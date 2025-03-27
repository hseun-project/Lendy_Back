const sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Loans",
    {
      loanId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      debtId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: "User",
          key: "userId"
        }
      },
      bondId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: "User",
          key: "userId"
        }
      },
      money: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      interest: {
        type: DataTypes.FLOAT(4, 2),
        allowNull: false
      },
      duringType: {
        type: DataTypes.ENUM("DAY", "MONTH"),
        allowNull: false
      },
      during: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        default: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: "Loans",
      timestamps: false
    }
  );
};
