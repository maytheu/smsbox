const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = mongoose.Schema({
  tag: {
    type: String,
  },
  contacts: String,
  message: { type: String, required: true },
  user: String
});

const Message = mongoose.model("Message", messageSchema);
module.exports = { Message };
