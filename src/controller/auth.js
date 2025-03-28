const app = require("express")();
const auth = require("../service/auth");

app.post("/id", auth.checkIdDuplication);
app.post("/mail", auth.sendMail);

module.exports = app;
