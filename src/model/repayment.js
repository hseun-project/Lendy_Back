const sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Repayment", {
    repaymentId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    loanId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "Loans",
        key: "loanId"
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      default: DataTypes.NOW
    },
    remainMoney: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
};
