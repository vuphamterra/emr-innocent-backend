"use strict";
const logger = require("../config/logger")

function parse_fill_patient_details_from_req (req) {
    logger.debug("Called createpatient ", req.body)
    logger.debug("Called createpatient ", req)

    var patientobj = new Object()

    patientobj.fname = req.body["firstName"]
    patientobj.lname = req.body["lastName1"]
    patientobj.phone_contact = req.body["phoneNumber1"]
    patientobj.email = req.body["emailAddress1"]

    patientobj.DOB = req.body["dob"]
    patientobj.sex = req.body["patientsex"]
    patientobj.drivers_license = req.body["patientuidtype"]
    patientobj.ss = req.body["patientuid1"]
    patientobj.street = req.body["address1"]
    patientobj.city = req.body["patientcity"]
    patientobj.state = req.body["patientState"]
    patientobj.country_code = req.body["patientcountry"]
    patientobj.postal_code = req.body["patientzip1"]

    return patientobj
}



module.exports = { parse_fill_patient_details_from_req }
