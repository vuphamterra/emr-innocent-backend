const Sequelize = require("sequelize")
const logger = require("../config/logger")
logger.debug(__dirname + "/../../.env")
require("dotenv").config({ path: __dirname + "/../../.env" })

// module.exports = new Sequelize(process.env.DATABASE_URL, {
module.exports = new Sequelize(
    process.env.EMR_DB,
    process.env.EMR_DB_USER,
    process.env.EMR_DB_PASS,
    {
        // module.exports = new Sequelize('openemr', 'root', 'root', {
        host: process.env.EMR_DB_HOST,
        dialect: process.env.EMR_DB_DIALECT,
        // host: "localhost",
        // dialect: "mysql",
        operatorsAliases: false,

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
)
