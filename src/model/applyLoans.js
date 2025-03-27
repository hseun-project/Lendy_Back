const sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "ApplyLoan",
    {
      applyLoanId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      debtId: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      loanType: {
        type: DataTypes.ENUM("PRIVATE_LOAN", "PUBLIC_LOAN"),
        allowNull: false
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
      state: {
        type: DataTypes.ENUM("PENDING", "APPROVAL", "REJECTED"),
        allowNull: false,
        default: "PENDING"
      },
      bondId: {
        type: DataTypes.STRING(20),
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "ApplyLoans",
      timestamps: false
    }
  );
};
