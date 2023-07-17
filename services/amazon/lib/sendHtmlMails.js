require("dotenv").config();

// Packages
const AWS = require('aws-sdk');
const logger = require('../../../utils/logger');

AWS.config.update({
  accessKeyId: process.env.SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SES_SECRET_KEY,
  region: 'eu-west-3',
});


const ses = new AWS.SES({ apiVersion: '2010-12-01' });

const sendHtmlMails = async ({ subject = '', body, emailsToSend }) => {
  let params = {
    Destination: {
      BccAddresses: [],
      CcAddresses: [],
      ToAddresses: emailsToSend,
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: body,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
    Source: 'contact@thesales.io',
  };

  const sendEmail = ses.sendEmail(params).promise();

  try {
    const mail = await sendEmail;
    logger.info(
      `Mail from SES sent successfully ${JSON.stringify(mail, null, 2)}`
    );
    return [mail, null];
  } catch (err) {
    logger.error('Error while sending mails via AWS SES: ', err);
    return [null, err.message];
  }
};

module.exports = sendHtmlMails;
