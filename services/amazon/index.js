const sendMails = require("./lib/sendMails");
const sendHtmlMails = require("./lib/sendHtmlMails");

const amazonService = {
  sendMails,
  sendHtmlMails,
};

module.exports = amazonService;
