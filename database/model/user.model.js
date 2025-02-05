const { Sequelize, DataTypes } = require('sequelize')

/** 
 * @param {Sequelize} sequelize
 * @returns {import('sequelize').ModelCtor<import('sequelize').Model<any, any>>}
 * 
*/
module.exports = (sequelize) => {
    const UserModel = sequelize.define("users", {
        id: {
            field: "id",
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        username: {
            field: "username",
            type: DataTypes.STRING(150),
            unique: true,
            allowNull: false
        },
        imageObjectName: {
            field: "image_object_name",
            type: DataTypes.STRING
        },
        imageOriginalName: {
            field: "image_original_name",
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        timestamps: true
    })
    return UserModel
}