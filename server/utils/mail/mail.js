const mailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const { welcome } = require("./welcomeTemplate");

require("dotenv").config();

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID_OAUTH,
  process.env.GOOGLE_CLIENT_SECRET_OAUTH,
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  access_token: process.env.GMAIL_ACCESS_TOKEN,
  refresh_token: process.env.GMAIL_REFRESH_TOKEN
});

const getEmailData = (to, name, token, template, actionData) => {
  let data = null;
  switch (template) {
    case "welcome":
      data = {
        from: "SmsBox - Bulk Sms solutions <maytheu98@gmail.com>",
        to,
        subject: `Welcome to Sms Box, ${name}`,
        html: welcome()
      };
      break;
    case "reset_password":
      data = {
        from: "Cinema Centre <maytheu98@gmail.com>",
        to,
        subject: `${name}, reset your password`,
        html: resetPass(actionData)
      };
      break;
    case "purchase":
      data = {
        from: "Cinema Centre <maytheu98@gmail.com>",
        to,
        subject: `${name}, Thank you for purchasing`,
        html: purchase(actionData)
      };
      break;
    case "updates":
      data = {
        from: "SmsBox - Bulk Sms solutions <updates@smsbox.com>",
        to,
        subject: Data.subject,
        html: welcome(actionData.email)
      };
      break;
      case "promotions":
        data = {
          from: "SmsBox - Bulk Sms solutions <promotions@smsbox.com>",
          to,
          subject:actionData.subject ,
          html: welcome(actionData.email)
        };
        break;
  
    default:
      data;
  }
  return data;
};

const sendEmail = (to, name, token, type, actionData = null) => {
  const smtpTransport = mailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "maytheu98@gmail.com",
      clientId: process.env.GOOGLE_CLIENT_ID_OAUTH,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_OAUTH,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: process.env.GMAIL_ACCESS_TOKEN
    }
  });
  let mail = "";
  if (type === "updates" || "promotions") {
    for (let i = 0; i < to.length; i++) {
      if (to[i] === to[i]) {
        mail = getEmailData(to[i], name[i], token, type, actionData);
        smtpTransport.sendMail(mail, function(error, response) {
          if (error) {
            console.log(error);
          } else {
            console.log(response);
          }
          smtpTransport.close();
        });
      }
    }
  } else {
    mail = getEmailData(to, name, token, type, actionData);
    smtpTransport.sendMail(mail, function(error, response) {
      if (error) {
        console.log(error);
      } else {
        console.log(response);
      }
      smtpTransport.close();
    });
  }
};

module.exports = { sendEmail };
