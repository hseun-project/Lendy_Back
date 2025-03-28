const app = require("express")();
const auth = require("../service/auth");
const { validateAccess } = require("../middleware/jwt");

app.post("/id/verify", auth.validateId);

module.exports = app;
