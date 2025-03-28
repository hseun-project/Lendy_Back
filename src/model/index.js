const Sequelize = require("sequelize");
const config = require("../config/config");

const User = require("./user");
const ApplyLoan = require("./applyLoans");
const Loans = require("./loans");
const Repayment = require("./repayment");

const db = {};

const sequelize = new Sequelize({ ...config, sync: false });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.ApplyLoan = ApplyLoan;
db.Loans = Loans;
db.Repayment = Repayment;

User.initiate(sequelize);
ApplyLoan.initiate(sequelize);
Loans.initiate(sequelize);
Repayment.initiate(sequelize);

User.associate(db);
ApplyLoan.associate(db);
Loans.associate(db);
Repayment.associate(db);

module.exports = db;
