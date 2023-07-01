const sendMails = require('./lib/sendMails');
const sendHtmlMails = require('./lib/sendHtmlMails');

const sendgridService = {
  
  sendMails,
  sendHtmlMails,
};

module.exports = sendgridService;
  