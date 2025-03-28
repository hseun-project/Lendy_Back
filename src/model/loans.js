const Sequelize = require("sequelize");

class Loans extends Sequelize.Model {
  static initiate(sequelize) {
    super.init(
      {
        loanId: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        debtId: {
          type: Sequelize.STRING(20),
          allowNull: false
        },
        bondId: {
          type: Sequelize.STRING(20),
          allowNull: false
        },
        money: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        interest: {
          type: Sequelize.FLOAT(4, 2),
          allowNull: false
        },
        duringType: {
          type: Sequelize.ENUM("DAY", "MONTH"),
          allowNull: false
        },
        during: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        startDate: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Loans",
        tableName: "Loans",
        paranoid: false,
        charset: "utf8",
        getterMethods: "utf8_general_ci"
      }
    );
  }

  static associate(db) {
    Loans.belongsTo(db.User, {
      foreignKey: "debtId",
      as: "debtLoans"
    });
    Loans.belongsTo(db.User, {
      foreignKey: "bondId",
      as: "bondLoans"
    });
    Loans.hasMany(db.Repayment, {
      foreignKey: "loanId",
      sourceKey: "loanId"
    });
  }
}

module.exports = Loans;
