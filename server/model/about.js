const mongoose = require("mongoose");

const aboutSchema = mongoose.Schema({
  about: {
    type: String,
    required: true
  }
});

const About = mongoose.model("About", aboutSchema);
module.exports = { About };
