const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  static initiate(sequelize) {
    super.init(
      {
        userId: {
          type: Sequelize.STRING(20),
          allowNull: false,
          primaryKey: true,
          autoIncrement: false
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        name: {
          type: Sequelize.STRING(10),
          allowNull: false
        },
        creditScore: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 500
        },
        userCode: {
          type: Sequelize.STRING,
          allowNull: true
        },
        personNumber: {
          type: Sequelize.STRING(7),
          allowNull: false
        },
        email: {
          type: Sequelize.STRING(30),
          allowNull: false,
          unique: true
        }
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "User",
        tableName: "User",
        paranoid: false,
        charset: "utf8",
        getterMethods: "utf8_general_ci"
      }
    );
  }

  static associate(db) {
    User.hasMany(db.Loans, {
      foreignKey: "debtId",
      sourceKey: "userId",
      as: "debtLoans"
    });
    User.hasMany(db.Loans, {
      foreignKey: "bondId",
      sourceKey: "userId",
      as: "bondLoans"
    });

    User.hasMany(db.ApplyLoan, {
      foreignKey: "debtId",
      sourceKey: "userId",
      as: "debtApply"
    });
    User.hasMany(db.ApplyLoan, {
      foreignKey: "bondId",
      sourceKey: "userId",
      as: "bondApply"
    });
  }
}

module.exports = User;
