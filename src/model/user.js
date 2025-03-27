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
      },
      personNumber: {
        type: DataTypes.STRING(7),
        allowNull: false
      },
      emailId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "Email",
          key: "emailId"
        }
      }
    },
    {
      sequelize,
      modelName: "User",
      timestamps: false
    }
  );
};
