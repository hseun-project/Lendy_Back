const sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Email",
    {
      emailId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: "User",
          key: "userId"
        }
      },
      email: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
      },
      code: {
        type: DataTypes.STRING(8),
        allowNull: false
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        default: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: "Email",
      timestamps: false
    }
  );
};
