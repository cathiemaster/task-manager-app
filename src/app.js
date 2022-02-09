const express = require("express");
require("./db/mongoose");
const userRoute = require("./routes/user-route");
const taskRoute = require("./routes/task-route");

const app = express();
app.use(express.json());

app.use(userRoute);
app.use(taskRoute);

module.exports = app;