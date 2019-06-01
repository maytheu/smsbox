const mongoose = require("mongoose");

const faqsSchema = mongoose.Schema({
  link_title: {
    type: String,
    required: true
  },
  name: { type: String, required: true },
  detail: {
    type: String,
    required: true
  }
});

const Faqs = mongoose.model("Faqs", faqsSchema);
module.exports = { Faqs };
