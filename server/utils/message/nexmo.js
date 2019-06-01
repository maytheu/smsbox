const nexmo = require("nexmo");

const sms = (from, to, message, userUnit, messageUnit, messageHistory) => {
  nexmo.message.sendSms(from, to, message, (err, responseData) => {
    if (err) {
      console.log(err);
      res.json({ success: err });
    } else {
      console.log(responseData);
      userUnit = userUnit - messageUnit;
      messageHistory.data = {
        id: req.message.id,
        unitDeducted: messageUnit,
        totalContacts: messageUnit,
        tag: req.message.tag,
        message: req.message.message
      }; //user info msg
      messageHistory.user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        unit: userUnit
      }; //adminto seee user details
    }
  });
};
