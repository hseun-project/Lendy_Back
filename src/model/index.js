const Sequelize = require("sequelize");
const config = require("../config/config");

const db = {};

const sequelize = new Sequelize({ ...config, sync: false });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize
  .authenticate()
  .then(() => {
    db.User = require("./user")(sequelize, Sequelize);
    db.ApplyLoan = require("./applyLoans")(sequelize, Sequelize);
    db.Loans = require("./loans")(sequelize, Sequelize);
    db.Repayment = require("./repayment")(sequelize, Sequelize);
  })
  .catch((err) => {
    console.error(err);
  });

// db.User = require("./user")(sequelize, Sequelize);
// db.ApplyLoan = require("./applyLoans")(sequelize, Sequelize);
// db.Loans = require("./loans")(sequelize, Sequelize);
// db.Repayment = require("./repayment")(sequelize, Sequelize);

module.exports = db;
