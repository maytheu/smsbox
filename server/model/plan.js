const mongoose = require("mongoose");

const planSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: 1
  },
  link_title: {
    type: String,
    required: true,
    unique: 1
  },
  detail: {
    type: String,
    required: true
  },
  highlight: {
    type:String,
    required: true,
  },
  amount: {
    type: Number,
    required: true
  },
  unit: {
    type: Number,
    required: true
  }
});

const Plan = mongoose.model("Plan", planSchema);
module.exports = { Plan };
