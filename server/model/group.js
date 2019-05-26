const mongoose = require("mongoose");

const groupSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: 1
  },
  contacts: {
    type: String,
  },
  user: String,
  units: Number
});

const Group = mongoose.model("Group", groupSchema);
module.exports = { Group };
