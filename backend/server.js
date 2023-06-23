require("dotenv").config();
const express = require("express");
const app = express();

const users = require("./routes/users");
const tennisCourts = require("./routes/tennisCourts");
const auth = require("./routes/auth");

app.use(express.json());
app.use("/api/users", users);
app.use("/api/tennisCourts", tennisCourts);
app.use("/api/auth", auth);
app.use("/api/verify", require("./routes/verify"));

app.listen(3000, () => {
  console.log("Listening...");
});

const mongoose = require("mongoose");
const connection_string = process.env.DATA_CONNECTION;
const uri = connection_string;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDb...", err));
