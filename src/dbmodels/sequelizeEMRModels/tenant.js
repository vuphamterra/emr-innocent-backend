const Sequelize = require('sequelize');
const db = require("../../config/emrmysqldb")

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tenant', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    tenant_name: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    tenant_uuid: {
      type: DataTypes.STRING(256),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tenant',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};


/**
 * @openapi
 *  components:
 *    schemas:
 *      tenant:
 *        type: object
 *        required:
 *          - tenant_name
 *        properties:
 *          tenant_name:
 *            type: string
 *          tenant_uuid:
 *            type: string
 *            format: uuid
 *            description: This is 128 byte long number
 *        example:
 *           name: demohospital.com
 *           tenant_uuid: 123456789
 */
