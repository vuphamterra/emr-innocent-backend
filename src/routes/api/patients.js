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

// Patient utils
const patient_controller = require("../../dbcontrollers/patient.controller")

const Users = models.users
const Tenants = models.tenant // Verify the tenant before adding users
const Patients_Data = models.patient_data // Verify the tenant before adding users

var Patient = function (patientobj) {
    // Basic Details
    this.fname = patientobj.fname
    this.lname = patientobj.lname
    this.phone_contact = patientobj.phone_contact
    this.email = patientobj.email
    this.DOB = patientobj.DOB
    this.sex = patientobj.sex
    this.drivers_license = patientobj.drivers_license
    this.ss = patientobj.ss
    this.street = patientobj.street
    this.city = patientobj.city
    this.state = patientobj.state
    this.country_code = patientobj.country_code
    this.postal_code = patientobj.postal_code
    this.pid = patientobj.postal_code
}


async function db_get_patient_list(tenant_id, username) {
    // This async function gets the tenants matching the tenant_name
    // It currently does not check if more than one tenant exist or not. TODO
    // Returns a promise of the tenant_id number
    patient_list = ""
    await Patients_Data.findAll({
            // The where class is needed to find the patient having the same tenant id
            // where: {
            //     tenant_id: tenant_id,
            //     username: username,

            // },
            raw: true,
        })
        .then((patient_data) => {
            logger.debug("Patient list is" + patient_data)
            patient_list = patient_data
        })
        .catch((err) => {
            logger.debug("Patient list fetch error " + tenant_id + "not found Err:" + err)
            throw new Error(
                "Patient list fetch error -  tenant check"
            )
        })

    return patient_list
}

async function db_create_patient(tenant_id, patient_data) {
    // This async function gets the tenants matching the tenant_name
    // It currently does not check if more than one tenant exist or not. TODO
    // Returns a promise of the tenant_id number
    patient_list = ""
    let pdata = new Patient(patient_data)
    logger.debug("patient fname data is " + patient_data["fname"])

    await Patients_Data.create({
            fname: patient_data["fname"],
            lname: patient_data['lname'],
            phone_contact: patient_data['phone_contact'],
            email: patient_data['email'],
            DOB: patient_data['DOB'],
            sex: patient_data['sex'],
            drivers_license: patient_data['drivers_license'],
            ss: patient_data['ss'],
            street: patient_data['street'],
            city: patient_data['city'],
            state: patient_data['state'],
            country_code: patient_data['country_code'],
            postal_code: patient_data['postal_code'],
            pid: 4,
        })
        .then((patient_data) => {
            logger.debug("Patient insert output is" + patient_data)
            patient_list = patient_data
        })
        .catch((err) => {
            logger.debug(
                "Patient insert  error " +
                tenant_id +
                " not found Err:" +
                err
            )
            throw new Error("Patient insert  error -  tenant check")
        })

    return patient_list
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

/**
 * @swagger
 * /patient/list:
 *  get:
 *    description: Deprecate this - this is currently taking to the Login page in EJS
 *    responses:
 *      '200':
 *        description: A successful response
 */

router.post("/list", function (req, res, next) {
    // This API gets the username and tenant and other HTTP Headers info
    // TODO : Validate the values for each of the field
    // Get the patient list based on the information

    logger.debug("Testing")
    // logger.debug("Patient  Body output is ", req.body)
    // logger.debug("Patient  header output is ", req.headers)
    // logger.debug("Patient  Session output is ", req.session)
    // logger.debug("Patient  User output is ",typeof( req.user[0]))
    // logger.debug("Patient  User output is ", Object.keys( req.user[0]))
    // logger.debug("Patient  User output is ", req.user[0]["dataValues"])
    logger.debug("User info is ", req.user)
    email = req.user["dataValues"]["email"]
    username = email.split("@")[0]
    tenant_name = email.split("@")[1]
    logger.debug("Email id is " + email)

    tenant_id = db_get_tenant_id(tenant_name)
        .then((tenant_id_result) => {
            logger.debug("Tenant uuid outside " + tenant_id_result)
            tenant_id = tenant_id_result
            if (!tenant_id) {
                error = new Error("Fetching Tenant list not working for this Request")
                 res.json({
                     result: false,
                     response: {},
                     error: error.message,
                 })
            }
            db_get_patient_list(tenant_id, username)
                .then((patients) => {
                    logger.debug("patient list is " + patients)
                    res.json({
                        result: true,
                        response: {
                        patient_list: patients
                    },
                    error:{}
                    })
                })
                .catch((err) => {
                    logger.debug("Patient list error " + err)
                    error = new Error("Patient list error " + err)
                    res.json({
                        result: false,
                        response: {},
                        error: error.message
                    })
                })
        })
        .catch((err) => {
            console.error("Main Catch - Patient list error : " + err)
            error = new Error("Patient list could not be obtained , Error: " + err)
            res.json({
                result: false,
                response: {},
                error: error.message
            })
        })
})

router.post("/create", function (req, res, next) {
    // This API gets the username and tenant and other HTTP Headers info
    // TODO : Validate the values for each of the field
    // Get the patient list based on the information

    // logger.debug("Patient Create Body output is ", req.body)
    logger.debug("Patient  header output is ", req.headers)
    logger.debug("Patient  Session output is ", req.session)

    email = req.user[0]["dataValues"]["username"]
    username = email.split("@")[0]
    tenant_name = email.split("@")[1]
    logger.debug("Email id is " + email)

    // Form the patient data for Insert
    let patient_data = patient_controller.parse_fill_patient_details_from_req(req)
    logger.debug("Patient Data Variable is ", patient_data)

    // username = req.headers["x-username"].split("@")[0]
    // tenant_name = req.headers["x-username"].split("@")[1]

    tenant_id = db_get_tenant_id(tenant_name)
        .then((tenant_id_result) => {
            logger.debug("Tenant uuid outside " + tenant_id_result)
            tenant_id = tenant_id_result
            if (!tenant_id) {
                error = new Error(
                    "Fetching patient list not working for this Request"
                )
                res.json({
                    result: false,
                    response: {},
                    error: error.message,
                })
            }
            db_create_patient(tenant_id, patient_data)
                .then((patients) => {
                    logger.debug("patient  is" + patients)
                   res.json({
                       result: true,
                       response: {
                           patient_list: patients,
                       },
                       error: {},
                   })
                })
                .catch((err) => {
                    logger.debug("Patient Create error " + err)
                     error = new Error("Patient Create error " + err)
                     res.json({
                         result: false,
                         response: {},
                         error: error.message,
                     })
                })
        })
        .catch((err) => {
            console.error("Main Catch - Patient Create error : " + err)
            error = new Error("Patient insert could not be performed")
             res.json({
                 result: false,
                 response: {},
                 error: error.message,
             })
        })
})

// router.post("/signup", userController.create)

module.exports = router
