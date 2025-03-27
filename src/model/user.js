const sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "User",
    {
      userId: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
        autoIncrement: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      creditScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default: 500
      },
      userCode: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "User",
      timestamps: false
    }
  );
};
