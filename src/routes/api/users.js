// This would be handling the user signup usecases

var express = require("express")
var router = express.Router()
const logger = require("../../config/logger")

// Database
const Sequelize = require("sequelize")
const sequelizeDB = require("../../config/emrmysqldb")
var initModels = require("../../dbmodels/sequelizeEMRModels/init-models")
    .initModels
var models = initModels(sequelizeDB)

const Users = models.users
const Tenants = models.tenant // Verify the tenant before adding users

async function validate_user_auth(tenant_id, username, password) {
    // This async function gets the tenants matching the tenant_name
    // It currently does not check if more than one tenant exist or not. TODO
    // Returns a promise of the tenant_id number
    user_id = ""
    await Users.findAll({
            where: {
                tenant_id: tenant_id,
                username: username,
                password: password
            },
            raw: true,
        })
        .then((user_data) => {
            logger.debug("User list is" + user_data)
            user_id = user_data[0]["id"]
            logger.debug("user uuid " + user_id)
        })
        .catch((err) => {
            logger.debug(
                "User with name " + tenant_id + "not found Err:" + err
            )
            throw new Error("Login Failure as part of user cred -  tenant check")
        })

    return user_id
}


async function db_get_tenant_id(tenant_name) {
    // This async function gets the users matching the tenant_name
    // It currently does not check if more than one tenant exist or not. TODO
    // Returns a promise of the tenant_id number
    tenant_id = ""
    await Tenants.findAll({
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
        .catch((err) => {
            logger.debug(
                "Tenant with name " + tenant_name + "not found Err:" + err
            )
            throw new Error("Login Failure as part of tenancy check")
        })
    logger.debug("Done with Await of Tenant")
    return tenant_id
}



/* GET users listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a sign resource")
})

router.post("/login", function (req, res, next) {
    // This API accepts the  username , password and tenant_name
    // TODO : Validate the values for each of the field
    // Get the tenant_id from the tenant function and if validate the user auth

    logger.debug("user Login Body output is ", req.body)

    username = req.body["login_username"].split("@")[0]

    password = req.body["login_password"]
    let tenant_name = req.body.login_username.split("@")[1]


    tenant_id = db_get_tenant_id(tenant_name)
        .then((tenant_id_result) => {
            logger.debug("Tenant uuid outside " + tenant_id_result)
            tenant_id = tenant_id_result
            if (!tenant_id) {
                error = new Error("SignIn not possible for this Request")
                res.render("error.ejs", {
                    message: "Error Sign In",
                    error,
                })
            }
            validate_user_auth(tenant_id, username, password)

                .then((users) => {
                    logger.debug("user Logged in")
                    res.json({
                        response: true,
                        title: "GeeksforGeeks"
                    })
                })
                .catch((err) => {
                    logger.debug("User Auth Error: " + err)
                    res.json({
                        response: false,
                        title: "GeeksforGeeksERROR"
                    })
                })
        })
        .catch((err) => {
            console.error("User unable to Login : " + err)
            error = new Error("Login not possible for this User")
            res.render("error.ejs", {
                message: "Error Sign in for User",
                error,
            })
        })
})

// router.post("/signup", userController.create)

module.exports = router
