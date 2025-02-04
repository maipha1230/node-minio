const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/index");
const  UserModel  = require("./model/user.model");

const sequelize = new Sequelize({
  host: config.db.host,
  database: config.db.name,
  username: config.db.user,
  password: config.db.password,
  port: config.db.port,
  dialect: "postgres",
});

const userModel = UserModel(sequelize)

module.exports = sequelize;
