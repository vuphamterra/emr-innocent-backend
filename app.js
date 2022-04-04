var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

var winston = require('./src/config/logger');
const logger = require("./src/config/logger")

const swaggerJsdoc = require('swagger-jsdoc');
// import swaggerJsdoc from 'swagger-jsdoc';

var swaggerUi = require('swagger-ui-express') //,
    // swaggerDocument = require('./swagger.json');

const jwt = require("jsonwebtoken")

let ERROR_CODE = {
  "DB_FAILURE": 1
}

const db = require("./src/config/emrmysqldb")

// Database
const sequelizeDB = require("./src/config/emrmysqldb")
var initModels = require("./src/dbmodels/sequelizeEMRModels/init-models")
  .initModels
var models = initModels(sequelizeDB)

const Users_Secure = models.users_secure

// NOTE : With Sequelize AUTO
// For some of the tables - primaryKey: true needs to be set -- then everything will work as expected
// For now commented them some of the tables under init-models

db.authenticate()
  .then(() => logger.debug("Auth Success"))
  .catch((err) => {
    logger.debug("Auth Failed  Error : " + err)
    process.exit(ERROR_CODE["DB_FAILURE"])
  })


async function db_validate_user(email) {
  const user = await Users_Secure.findOne({
    where: {
      email: email,
    },
  }).then((user) => {
    logger.debug("The user is validated" + user)
  }).catch((err) => {
    logger.debug("The user is not validated" + err)
  })
  return user
}


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Live247 Swagger API',
      version: '1.0.0',
      description: 'Live247 Api Interfaces'
    },
  },
  apis: ['./src/routes/api/*.js', './src/dbmodels/sequelizeEMRModels/*.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

var indexRouter = require('./src/routes/api/index');
var usersRouter = require('./src/routes/api/users');
var signRouter = require('./src/routes/api/sign');
var patientsRouter = require("./src/routes/api/patients")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(morgan('combined', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use(cookieParser())

// Static files from this will be loaded without checking the token
app.use(express.static(path.join(__dirname, 'public')));

// Swagger Route
// https://blog.cloudboost.io/adding-swagger-to-existing-node-js-project-92a6624b855b
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification,{ explorer: true }));
// app.use('/api/v1', router);

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(openapiSpecification);
});

// Verifies the JWT token against the x-access-token from the request header
app.use(async (req, res, next) => {
  // app.use(function (req, res, next)  {
  // logger.debug("THe cookie is " + Object.keys(req.cookies))
  // logger.debug("THe cookie is " + typeof (req.headers.cookie))
  logger.debug("The cookie is "+req.headers.cookie)
  logger.debug("Verifying access token is "+req.path)
  if (req.cookies[process.env.TOKEN_KEY]) {
    const accessToken = req.cookies[process.env.TOKEN_KEY]
    try {
        var { userId, exp }  = await jwt.verify(
            accessToken,
            process.env.JWT_SECRET
        )
        logger.debug(
            "Access Token for the User : " + userId + " , Expiry :  " + exp
        )
    }
    catch (err) {
      logger.debug("Cookie JWK Error : " + err)
      res.clearCookie(process.env.TOKEN_KEY)
      if (req.path === "/sign/login" || req.path === "/signup" || req.path === "/sign/signup") {
        next()
      } else {
          res.redirect("/login")
          return
      }
    }
    logger.debug("Access Token for the User : " + userId + " , Expiry :  " + exp)
    // Check if token has expired
    if (exp < Date.now().valueOf() / 1000) {
      // return res
      //   .status(401)
      //   .json({
      //     error: "JWT token has expired, please login to obtain a new one",
      //   })
       logger.debug(
           "JWT token has expired, please login to obtain a new one" + req.path
       )
       req.clearCookie(process.env.TOKEN_KEY)
       res.redirect("/login")
       return
    }
    logger.debug("Token is approved - For user" + userId)
    // Ideally from Redis kind of service
    // API_TOKEN Can also be validated for more security
    // await db_validate_user(userId)
    await Users_Secure.findAll({
        attributes: ["id", "email", "role", "tenant"],
        where: {
          email: userId
        },
      })
      .then((user_data) => {
        logger.debug("Setting the local value for the response" + user_data)
        res.locals.loggedInUser = user_data[0]
      })
      .catch(err => {
        logger.debug("Error is " + err)
      })

    next()
  } else {
    logger.debug("The Token key was not present for "+req.path)
    next()
  }
})

// Verify the logged in user or redirect to login page
// exports.allowIfLoggedin = async (req, res, next) => {
// app.use(async (req, res, next) => {
app.use(function (req, res, next) {
  try {
    logger.debug("Validate Logged In user : Path is " + req.path)
    logger.debug("Validate Logged In user - res value is " + res.locals.loggedInUser)
    logger.debug(res.locals.loggedInUser)
    if (
      (req.path === "/login" ||
        req.path === "/sign/login" || req.path === "/signup" || req.path === "/sign/signup") &&
      (typeof res.locals.loggedInUser === "undefined")
    ) {
      logger.debug("I am inside" + res.locals.loggedInUser+" req path is : "+req.path)
      // next()
    } else if (typeof res.locals.loggedInUser === "undefined") {
      logger.debug("req else path is" + req.path)
      res.redirect("/login")
      return
    }
    const user = res.locals.loggedInUser
    if (user) {
      req.user = user
    }
    next()
  } catch (error) {
    logger.debug("The log in failure error is"+error)
    logger.debug("The log in failure error is" + error.message)
    next(error)
  }
})


// Routes for the Project
app.use('/', indexRouter);

app.use('/users', usersRouter);

// Handles signing of the user into the System
app.use('/sign', signRouter);

// Handles signing of the user into the System
app.use('/patients', patientsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var port = process.env.WEB_APP_PORT;

app.listen(port, function () {
  logger.debug("Server running on port => ", port);
});

module.exports = app;
