const sendgridTRansport = require("nodemailer-sendgrid-transport");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport(
    sendgridTRansport({
      auth: {
        api_key: process.env.API_KEY
      }
    })
  );

exports.sendemail=(ownermail, readername, suggestion, recipename) =>{
    console.log("inside suggestmail")
    transporter.sendMail({
        to: ownermail,
        from: "iokll@wifimaple.com",
        subject: readername +' sent you a suggestion for your '+ recipename + ' recipe',
        html:`<html>
        <body>
        <h3>"${suggestion}"</h3>
        </body>
        </html>`,
    });

}