const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = mongoose.Schema({
  tag: {
    type: String,
    unique: 1
  },
  contacts: String,
  group: {
    type: Schema.Types.ObjectId,
    ref: "Group"
  },
  message: { type: String, required: true },
  user: String
});

const Message = mongoose.model("Message", messageSchema);
module.exports = { Message };
