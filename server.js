
const express = require("express");
const app = express();
// const bodyParser = require("body-parser");

// parse application/json
// app.use(bodyParser.json());
app.use(express.json());

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));

// const router = express.Router();
const port = process.env.PORT || 7000;
// getting-started.js
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://taskUser:taskUser@cluster0.igdsh.mongodb.net/mongoChallegeDb?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// const mongodb = require("mongodb");
// let db;

// let connectionString =
//   "mongodb+srv://taskUser:taskUser@cluster0.igdsh.mongodb.net/myDatabase?retryWrites=true&w=majority";
// mongodb.connect(
//   connectionString,
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   function (err, database) {
//     if (err) {
//       console.error(err.message);
//       return;
//     }
//     db = database.db();
//     // app.listen(7000);
//     console.log("Great! Mongodb Atlas connected!");
//   }
// );

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("Great! Mongodb Atlas connected!");
});
app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
app.get("/homepage", (req, res) => {
  res.send("LOL Welcome!!!!");
});
// app.use(express.json());

const userRoute = require("./routes/user");
app.use("/user", userRoute);

const accountabilityTeamRoute = require("./routes/accountability_team");
app.use("/accountabilityTeam", accountabilityTeamRoute);
// const userQuickTaskRoute = require("./routes/user_quick_task");
// app.use("/userQuickTask", userQuickTaskRoute);

const inspireChatRoute = require("./routes/inspire_chat");
app.use("/inspireChat", inspireChatRoute);

const goalRoute = require("./routes/goal");
app.use("/goal", goalRoute);

const crudOpRoute = require("./routes/crud_op/crud_op");
app.use("/crudOp", crudOpRoute);

const reportedMsgRoute = require("./routes/reported");
app.use("/reportPost", reportedMsgRoute);
module.exports.db = db;
