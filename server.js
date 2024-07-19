const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./src/config/db");
const taskRoutes = require("./src/routes/task");
const userRoutes = require("./src/routes/user");
const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
