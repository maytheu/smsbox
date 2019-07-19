const mailer = require("nodemailer");
// const { google } = require("googleapis");
// const OAuth2 = google.auth.OAuth2;

const welcome = require("./welcomeTemplate");

require("dotenv").config();

// const oauth2Client = new OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   "https://developers.google.com/oauthplayground" // Redirect URL
// );

// oauth2Client.setCredentials({
//   access_token: process.env.ACCESS_TOKEN,
//   refresh_token: process.env.REFRESH_TOKEN
// });

const getEmailData = (to, name, token, template, actionData) => {
  let data = null;
  switch (template) {
    case "welcome":
      data = {
        from: "SmsBox - Bulk Sms solutions <maytheu98@gmail.com>",
        to,
        subject: `Welcome to Sms Box Arena ${name}`,
        html: welcome()
      };
      break;
    //   case "reset_password":
    //     data = {
    //       from: "Cinema Centre <maytheu98@gmail.com>",
    //       to,
    //       subject: `${name}, reset your password`,
    //       html: resetPass(actionData)
    //     };
    //     break;
    //   case "purchase":
    //     data = {
    //       from: "Cinema Centre <maytheu98@gmail.com>",
    //       to,
    //       subject: `${name}, Thank you for purchasing`,
    //       html: purchase(actionData)
    //     };
    //     break;
case 'update':
    data = {
      from: "SmsBox - Bulk Sms solutions <maytheu98@gmail.com>",
      to,
      subject: `Welcome to S ${name}`,
      html: welcome(data)
    };
    break;

    default:
      data;
  }
  return data;
};

const sendEmail = (to, name, token, type, actionData = null) => {
  // const smtpTransport = mailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     type: "OAuth2",
  //     user: "maytheu98@gmail.com",
  //     clientId: process.env.GOOGLE_CLIENT_ID,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  //     refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  //     accessToken: process.env.GMAIL_ACCESS_TOKEN
  //   }
  // });

  // const mail = getEmailData(to, name, token, type, actionData);

  // smtpTransport.sendMail(mail, function(error, response) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log(response);
  //   }
  //   smtpTransport.close();
  // });
  let index = ''
  to.forEach((to, i, array) => {
     
      console.log(to)
      console.log(name[to.indexOf(array[i])])
      
	  console.log(array[i])
	  console.log(`${name},,${to}`)
  });
  for(let i = 0; i < to.length; i++){
	   if (to[i] === to[i]){
		   console.log(to[i])
		  console.log(name[i])
	  }
	  
  }
};

module.exports = { sendEmail };
