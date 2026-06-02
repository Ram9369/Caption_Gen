const express = require("express");
const cors = require("cors");

const authRoute = require("./routes/auth.route");
const cookieParser = require("cookie-parser");
const postRoute = require("./routes/post.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

module.exports = app;
