// This would be handling the user signup usecases

var express = require("express")
var router = express.Router()
const logger = require("../../config/logger")

// Utility Functions for the Roles and Authorization
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

// Database
const Sequelize = require("sequelize")
const sequelizeDB = require("../../config/emrmysqldb")
var initModels = require("../../dbmodels/sequelizeEMRModels/init-models").initModels
var models = initModels(sequelizeDB)

const Users_Secure = models.users_secure
const API_TOKEN = models.api_token
const Tenants = models.tenant // Verify the tenant before adding users

async function hashPassword(password) {
    return await bcrypt.hash(password, 10)
}

async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword)
}

async function db_get_tenant_id(tenant_name) {
    // This async function gets the tenants matching the tenant_name
    // It currently does not check if more than one tenant exist or not. TODO
    // Returns a promise of the tenant_id number
    tenant_id = 'undefined'
    await Tenants
        .findAll({
            where: {
                tenant_name: tenant_name,
            },
            raw: true,
        })
        .then((tenant_data) => {
            logger.debug("Tenant list is" + tenant_data)
            tenant_id = tenant_data[0]["id"]
            logger.debug("Tenant uuid " + tenant_id)
        })
        .catch((err) =>
            logger.debug(
                "Tenant with name " + tenant_name + "not found Err:" + err
            )
        )
    return tenant_id
}


async function db_create_users(user_data) {
    logger.debug("Create users")
    const {
        email,
        password,
        role,
        tenant
    } = user_data
    const hashedPassword = await hashPassword(password)
    logger.debug("Hashed password: " + hashedPassword)
    await Users_Secure.create({
            username: email,
            email: email,
            password: hashedPassword,
            role: role,
            tenant: tenant,
        })
        .then((users) => {
            logger.debug("user created" + users)
            return {
                "result": true,
                "response": users
            }
        })
        .catch((err) => {
            logger.debug("User addition failed Error: " + err)
            return {
                "result": false,
                "response": err
            }
        })
}


async function db_validate_user(email) {
    const user = await Users_Secure.findOne({
        where: {
            email: email
        },
    })
    return user
}

async function db_validate_user_auth(tenant_id, username, password) {
    // This async function gets the tenants matching the tenant_name
    // It currently does not check if more than one tenant exist or not. TODO
    // Returns a promise of the tenant_id number
    user_id = ""
    await Users.findAll({
            where: {
                tenant_id: tenant_id,
                username: username,
                password: password,
            },
            raw: true,
        })
        .then((user_data) => {
            logger.debug("User list is" + user_data)
            user_id = user_data[0]["id"]
            logger.debug("user uuid " + user_id)
        })
        .catch((err) => {
            logger.debug("User with name " + tenant_id + "not found Err:" + err)
            throw new Error(
                "Login Failure as part of user cred -  tenant check"
            )
        })

    return user_id
}


// All the APIs are hosted Below for User and Signup

/* GET users listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a sign resource")
})

router.post("/signup", function (req, res, next) {
    // This API accepts the firstname, lastname, mobile , username , password and tenant_name
    // TODO : Validate the values for each of the field
    // Get the tenant_id from the tenant function and if valid insert the user to the db

    logger.debug("user create Body output is ", req.body)

    fname = req.body["first_name"]
    lname = req.body["last_name"]
    phone = req.body["mob_no"]
    username = req.body["user_name"]
    password = req.body["password"]
    tenant_name = req.body["tenant_name"]

    tenant_id = db_get_tenant_id(tenant_name)
        .then(tenant_id_result => {
            tenant_id = tenant_id_result
            logger.debug("Tenant uuid outside " + tenant_id_result)

            if (typeof tenant_id_result === "undefined") { // || !tenant_id) {
                error = new Error("SignUp not possible for this Request")
                return res.json({
                    "result": false,
                    "response": {},
                    "error": error
                })
            }
            req.body['tenant'] = tenant_id
            results = db_create_users(req.body)
                .then(results => {
                    logger.debug("user created")
                    return res.json({
                        "result": true,
                        "response": results,
                        "error": {}
                    })
                })
                .catch(err => {
                    logger.debug("User addition failed Error: " + err)
                    return res.json({
                        result: false,
                        response: {},
                        error: results
                    })
                })
        })
        .catch(err => {
            console.error("User unable to create : " + err)
            error = new Error("SignUp not possible for this User")
            return res.json({
                result: false,
                response: {},
                error: error
            })
        })

})

router.post("/login", function (req, res, next) {
    // This API accepts the  username , password and tenant_name
    // TODO : Validate the values for each of the field
    // Get the tenant_id from the tenant function and if validate the user auth

    logger.debug("User Login Body output is ", req.body)
    const { login_username, login_password } = req.body
    try {
        logger.debug("Checking the domain")
        let tenant_name = login_username.split("@")[1]
        logger.debug("tenant_name is "+tenant_name)
    } catch (err) {

        logger.debug("Error in username@domain : " + req.body["login_username"])
        return res.json({
            "result": false,
            response: {},
            error: err
        })
    }
    logger.debug("Out of the domain check")

    user = db_validate_user(login_username).then((user) => {
            logger.debug("User is "+user)
            if (!user) {
                err = new Error("Email does not exist")
                return res.json({
                    result: false,
                    response: {},
                    error: err.message,
                })
            }
            password = req.body["login_password"]
            const validPassword = validatePassword(password, user.password)
            logger.debug("validating the password ")
            if (!validPassword) {
                err = new Error("Password is not correct")

                return res.json({
                    result: false,
                    response: {},
                    error: err.message,
                })
                // return next()
            }
            logger.debug("User info is " + user)
            const accessToken = jwt.sign({
                    userId: user.email
                },
                process.env.JWT_SECRET, {
                    expiresIn: 600,
                }
            )
            logger.debug("Api token is created")
            API_TOKEN.create({
                    token_auth: accessToken,
                    email: user.email,
                    user_id: user.id,
                    // expiry: new Date(new Date().getTime() + 1000),
                    expiry: new Date(
                        new Date().getTime() + Number(process.env.JWT_SECRET_INTERVAL)
                    ),
                })
                .then((result) => logger.debug("Login jwt " + result))
                .catch((err) => logger.debug("Jwt create error" + err))
            res.cookie("tokenKey", accessToken)
            res.status(200).json({
                result: true,
                response: {
                    email: user.email,
                    role: user.role
                },
                error: {}
            })
        })
        .catch((err) => {
            logger.debug("Error in user validation" + err)
            return res.json({
                result: false,
                response: {},
                error: err,
            })
        })
})

// router.post("/signup", userController.create)

module.exports = router
