const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config({
  path: ".env",
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
mongoose.set("strictQuery", true);
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  family: 4,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.get("/", (req, res) => res.send("Hello World!"));
const authRouter = require("./routes/auth");
app.use("/api/auth", authRouter);
const recordRouter = require("./routes/recordings");
app.use("/api/recordings", recordRouter);

const port = 3001;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
