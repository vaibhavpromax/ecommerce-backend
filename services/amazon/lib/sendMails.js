require("dotenv").config();

// Packages
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const logger = require("../../../utils/logger");

const sendMails = async ({ subject = "", body, emailsToSend }) => {
  try {
    const mail = sgMail.send({
      to: emailsToSend, // receiver email address
      from: "contact@thesales.io",
      subject: subject,
      html: body,
    });
    return [mail, null];
  } catch (error) {
    return [null, error];
  }
  // .then((mail) => {
  //   return [mail, null];
  // })
  // .catch((error) => {
  //   logger.error("Error while sending mails", error);
  //   return [null, error.message];
  // });
};

module.exports = sendMails;
