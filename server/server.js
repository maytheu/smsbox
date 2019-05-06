const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const moment = require("moment");
const cookieSession = require("cookie-session");

const app = express();

require("dotenv").config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cookieSession({
    maxAge: 6 * 24 * 60 * 60 * 1000,
    keys: [process.env.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("client/build"));



const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));