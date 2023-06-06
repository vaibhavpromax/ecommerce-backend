// require("dotenv").config();

// // Packages
// const sgMail = require("@sendgrid/mail");
// const logger = require("../../../utils/logger");

// const sendMails = async ({ subject = "", body, emailsToSend }) => {
//   sgMail
//     .send({
//       To: emailsToSend, // receiver email address
//       from: "contact@ungraindanslaboite.com",
//       subject: subject,
//       text: body,
//     })
//     .then((mail) => {
//       return [mail, null];
//     })
//     .catch((error) => {
//       logger.error("Error while sending mails", error);
//       return [null, error.message];
//     });
// };

// module.exports = sendMails;
