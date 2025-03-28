const Sequelize = require("sequelize");

class ApplyLoan extends Sequelize.Model {
  static initiate(sequelize) {
    super.init(
      {
        applyLoanId: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        debtId: {
          type: Sequelize.STRING(20),
          allowNull: false
        },
        loanType: {
          type: Sequelize.ENUM("PRIVATE_LOAN", "PUBLIC_LOAN"),
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
        state: {
          type: Sequelize.ENUM("PENDING", "APPROVAL", "REJECTED"),
          allowNull: false,
          defaultValue: "PENDING"
        },
        bondId: {
          type: Sequelize.STRING(20),
          allowNull: true
        }
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "ApplyLoan",
        tableName: "ApplyLoan",
        paranoid: false,
        charset: "utf8",
        getterMethods: "utf8_general_ci"
      }
    );
  }

  static associate(db) {
    ApplyLoan.belongsTo(db.User, {
      foreignKey: "debtId",
      as: "debtApply"
    });
    ApplyLoan.belongsTo(db.User, {
      foreignKey: "bondId",
      as: "bondApply"
    });
  }
}

module.exports = ApplyLoan;
