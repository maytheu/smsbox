const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const moment = require("moment");
const multer = require("multer");
const fs = require("fs"); //access file dir
const path = require("path");
const Nexmo = require("nexmo");
const cron = require("node-cron");

const app = express();

require("dotenv").config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_KEYS,
  apiSecret: process.env.NEXMO_SECRET
});

app.use(express.static("client/build"));

const { User } = require("./model/user");
const { Group } = require("./model/group");
const { Message } = require("./model/message");
const { Plan } = require("./model/plan");
const { Faqs } = require("./model/faqs");
const { About } = require("./model/about");

const { auth } = require("./middleware/auth");
const { unit } = require("./middleware/unit");
const { admin } = require("./middleware/admin");
const { bonus } = require("./middleware/bonus");

require("./utils/auth/passport");
const { input } = require("./utils/validate/input");
const { total } = require("./utils/validate/total");
const { sendEmail } = require("./utils/mail/mail");

//=================================
//             USER
//=================================
app.post("/api/user/register", (req, res) => {
  const date = new Date();
  const pId = `${date.getFullYear()}${date.getSeconds()}${date.getMilliseconds()}`;

  const user = new User({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    profileId: pId,
    role: req.body.role
  });

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

app.post("/api/user/reset_user", (req, res) => {
  //send email to database for reset password
  User.findOne({ email: req.body.email }, (err, user) => {
    user.generateResetToken((err, user) => {
      if (err) return res.json({ success: false, err });
      // sendEmail(user.email, user.name, null, "reset_password", user);
      return res.json({ success: true });
    });
  });
});

app.post("/api/user/reset_password", (req, res) => {
  var today = moment()
    .startOf("day")
    .valueOf();

  User.findOne(
    {
      resetToken: req.body.resetToken,
      resetTokenExp: {
        $gte: today
      }
    },
    (err, user) => {
      if (!user)
        return res.json({
          success: false,
          message: "Sorry, bad token, generate a new one."
        });

      user.password = req.body.password;
      user.resetToken = "";
      user.resetTokenExp = "";

      user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
          success: true
        });
      });
    }
  );
});

app.post("/api/user/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({ loginSuccess: false, message: "Email not found" });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "Incorrect password" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        user.lastLogin = moment();
        
        user.save((err, user) => {
          if (err) return res.json({ success: false, err });
          res
            .cookie("w_auth", user.token)
            .status(200)
            .json({
              loginSuccess: true
            });
        });
      });
    });
  });
});

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "/signin"
  }),
  (req, res) => {
    var token = req.user.token;
    res.cookie("w_auth", token);
    res.redirect("/user/dashboard");
  }
);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/signin"
    // successRedirect: "/"
  }),
  (req, res) => {
    var token = req.user.token;
    res.cookie("w_auth", token);
    res.redirect("/user/dashboard");
  }
);

app.get("/api/user/auth", auth, (req, res) => {
  res.status(200).json({
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    profileId: req.user.profileId,
    email: req.user.email,
    name: req.user.name,
    sent: req.user.sent,
    units: req.user.units
  });
});

app.post("/api/user/edit_profile", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: req.body },
    { new: true },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
        userUpdate: doc
      });
    }
  );
});

app.get("/api/user/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true
    });
  });
});

//=================================
//             MESSAGE
//=================================
/*send message
make sure unit is available
calculate the message for deduction
update the database with the unit and sent message
*/

app.post("/api/message/new_message", auth, unit, (req, res) => {
  let messageHistory = {};
  let userUnit = req.user.units;
  let messageUnit = total(req.body.contacts);
  const message = new Message(req.body);
  if (messageUnit < userUnit) {
    //proceed tto message api
    //update the databse with unit and sent array
    let numbers = new Array();
    numbers = req.body.contacts.split(",");
    function after_forloop() {
      console.log("after");
    }
    function releaseE() {
      console.log("regular");
    }
    for (i = 0; i < messageUnit; i++) {
      console.log(numbers[i]);
      releaseE();
      if (i === messageUnit - 1) {
        after_forloop();
      }
    }
    // nexmo.message.sendSms(
    //   req.body.tag,
    //   req.body.contacts,
    //   req.body.message,
    //   (err, responseData) => {
    //     if (err) {
    //       res.json({ success: err });
    //     } else {
    //       console.log(responseData.messages);
    //       userUnit = userUnit - messageUnit;
    //       messageHistory.data = {
    //         id: req.responseData.messages.message-id,
    //         unitDeducted: messageUnit,
    //         totalContacts: messageUnit,
    //         tag: req.body.tag,
    //          contacts: req.body.contacts,
    //         message: req.body.message
    //       }; //user info msg
    //       messageHistory.user = {
    //         id: req.user._id,
    //         name: req.user.name,
    //         email: req.user.email,
    //         unit: userUnit
    //       }; //adminto seee user details
    //       User.findOneAndUpdate(
    //         { _id: req.user._id },
    //         { $push: { sent: messageHistory } },
    //         { $set: { units: userUnit } },
    //         { new: true },
    //         (err, user) => {
    //           if (err) return res.json({ success: err });
    //           message.save((err, doc) => {
    //             if (err) return res.json({ success: err });
    //             res.status(200).json({ success: true });
    //           });
    //         }
    //       );
    //     }
    //   }
    // );
  } else {
    res.json({ success: "You do not have enough unit" });
  }
});

app.get("/api/message/history", auth, admin, (req, res) => {
  Message.find({}, (err, message) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(message);
  });
});

app.get("/api/message/view_message", auth, (req, res) => {
  let message = req.query.id;

  Group.find({ _id: { $in: message } }).exec((err, docs) => {
    return res.status(200).send(docs);
  });
});

app.get("/api/message/delete", auth, (req, res) => {
  let historyId = req.query.id;

  User.findOneAndRemove({ sent: { $in: historyId } }).exec((err, docs) => {
    return res.status(200).send({ success: true });
  });
});

/*Edit message
find the messsage with the id
to update the fields

you canow edit the message for sending
and performing the send message operation again
*/
app.post("/api/message/edit_message", auth, bonus, unit, (req, res) => {
  let userUnit = req.user.units;
  let messageUnit = total(req.body.contacts);
  const message = new Message(req.body);
  if (messageUnit < userUnit) {
    nexmo.message.sendSms(
      req.body.tag,
      req.body.contacts,
      req.body.message,
      (err, responseData) => {
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
          User.findOneAndUpdate(
            { _id: req.user._id },
            { $push: { sent: messageHistory } },
            { $set: { units: userUnit } },
            { new: true },
            (err, user) => {
              if (err) return res.json({ success: err });
              Message.findOneAndUpdate(
                { _id: req.body._id },
                { $set: req.body },
                { new: true },
                (err, doc) => {
                  if (err) return res.json({ success: err });
                  return res.status(200).send({
                    success: true,
                    updateMessage: doc
                  });
                }
              );
            }
          );
        }
      }
    );
  } else {
    res.json({ success: "You do not have enough unit" });
  }
});

//=================================
//             GROUP
//=================================
app.get("/api/group/group", auth, (req, res) => {
  Group.find({ user: req.user._id }, (err, group) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(group);
  });
});
const upload = multer({ dest: "uploads" });

app.post("/api/group/upload", auth, upload.single("file"), (req, res) => {
  const absolutePath = path.join(__dirname, "../", req.file.path);
  const jsonString = fs.readFileSync(absolutePath, "utf-8");
  // if (err) return res.json({ success: "Incompatible file type" });
  console.log(jsonString);
  res.status(200).send({ success: true, contact: jsonString });
});

app.post("/api/group/create_group", auth, (req, res) => {
  const group = new Group({
    user: req.user._id,
    title: req.body.title,
    contacts: req.body.contacts,
    units: total(req.body.contacts)
  });

  if (input(req.body.contacts)) {
    group.save((err, doc) => {
      if (err) return res.json({ success: err });
      res.status(200).json({ success: true });
    });
  } else {
    return res.json({ success: "Non compatible number format" });
  }
});

app.post("/api/group/edit_group", auth, (req, res) => {
  let verify = {
    contacts: req.body.contacts,
    units: total(req.body.contacts),
    title: req.body.title
  };
  if (input(req.body.contacts)) {
    Group.findOneAndUpdate(
      { _id: req.body._id },
      { $set: verify },
      { new: true },
      (err, doc) => {
        if (err) return res.json({ success: err });
        return res.status(200).send({
          success: true,
          updateGroup: doc
        });
      }
    );
  } else {
    return res.json({ success: "Non compatible format" });
  }
});

app.get("/api/group/view_group", auth, (req, res) => {
  let group = req.query.id;

  Group.find({ _id: { $in: group } }).exec((err, docs) => {
    return res.status(200).send(docs);
  });
});

app.get("/api/group/delete", auth, (req, res) => {
  let group = req.query.id;

  Group.findOneAndRemove({ _id: { $in: group } }).exec((err, docs) => {
    return res.status(200).send({ success: true });
  });
});

//=================================
//             ABOUT
//=================================
app.get("/api/about", (req, res) => {
  About.find({}, (err, about) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(about);
  });
});

app.post("/api/about/edit", auth, admin, (req, res) => {
  About.findOneAndUpdate(
    { _id: req.body.id },
    { $set: { about: req.body.about } },
    { new: true },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
        updateAbout: doc
      });
    }
  );
});

//this route will be available for once
app.post("/api/about/new_about", auth, admin, (req, res) => {
  const about = new About(req.body);

  about.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

//=================================
//             PLAN
//=================================
app.get("/api/plan/view_plans", (req, res) => {
  Plan.find({}, (err, plan) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(plan);
  });
});

app.get("/api/plan/plan_details", (req, res) => {
  let plan = req.query.title;

  Plan.find({ link_title: { $in: plan } }).exec((err, docs) => {
    return res.status(200).send(docs);
  });
});

app.post("/api/plan/new_plan", auth, admin, (req, res) => {
  const plan = new Plan(req.body);

  plan.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

app.post("/api/plan/edit_plan", auth, admin, (req, res) => {
  Plan.findOneAndUpdate(
    { _id: req.body._id },
    { $set: req.body },
    { new: true },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
        updatePlan: doc
      });
    }
  );
});

//=================================
//             EMAILS
//=================================
app.post("/api/email/update", auth, admin, (req, res) => {
  User.distinct("email", (err, email) => {
    User.distinct("name", (err, name) => {
      let detail = { subject: req.body.subject, email: req.body.email };
      sendEmail(email, name, null, "updates", detail);
      return res.json({ success: true });
    });
  });
});

app.post("/api/email/promotion", auth, admin, (req, res) => {
  User.distinct("email", (err, email) => {
    User.distinct("name", (err, name) => {
      let detail = { subject: req.body.subject, email: req.body.email };
      sendEmail(email, name, null, "promotions", detail);

      return res.json({ success: true });
    });
  });
});

// schedule tasks to be run on the server
// cron.schedule("30 0/1450 * * *", function(req, res) {
  cron.schedule("* * * * *", function(req, res) {

let nowDate = moment()
let dateDiff = ''
User.find({}, (err, user)=>{
  if (err) return res.status(400).send(err);
  //save lastLogin in a object - check  the last login and create a copy of new one then find by each last login by iterating using loop
// if(dateDiff >= 4320000000){//50 days login

// }
console.log(nowDate)
let loginDates={}
user.name = loginDates
console.log("running a task every hour");
console.log(user)
for(let key in user){
  console.log(`loop ${user[key].lastLogin}`)
  dateDiff = nowDate - user.lastLogin
  console.log(dateDiff)

}
// user.lastLogin = loginDates
// dateDiff = nowDate - user.lastLogin

})
});
cron.schedule("* 0/1 * * *", function(req, res) {
  console.log("running a task every hour");
  console.log(moment());
  console.log(moment().add(2, "months")); //86400000
  console.log(moment().add(2, "months") - moment());
});

//=================================
//             FAQS
//=================================
app.get("/api/faqs/list", (req, res) => {
  Faqs.find({}, (err, faqs) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(faqs);
  });
});

app.get("/api/faqs/view", (req, res) => {
  let faqs = req.query.title;

  Faqs.find({ link_title: { $in: faqs } }).exec((err, docs) => {
    return res.status(200).send(docs);
  });
});

app.post("/api/faqs/edit", auth, admin, (req, res) => {
  Faqs.findOneAndUpdate(
    { _id: req.body._id },
    { $set: req.body },
    { new: true },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
        updateFaqs: doc
      });
    }
  );
});

app.post("/api/faqs/create", auth, admin, (req, res) => {
  const faqs = new Faqs(req.body);

  faqs.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

// DEFAULT
if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.get("/*", (req, res) => {
    res.sendfile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
