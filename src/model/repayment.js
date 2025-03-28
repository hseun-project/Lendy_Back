const Sequelize = require("sequelize");

class Repayment extends Sequelize.Model {
  static initiate(sequelize) {
    super.init(
      {
        repaymentId: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        loanId: {
          type: Sequelize.BIGINT,
          allowNull: false
        },
        date: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        remainMoney: {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Repayment",
        tableName: "Repayment",
        paranoid: false,
        charset: "utf8",
        getterMethods: "utf8_general_ci"
      }
    );
  }

  static associate(db) {
    Repayment.belongsTo(db.Loans, {
      foreignKey: "loanId"
    });
  }
}

module.exports = Repayment;
