const generateRedisKeyNames = {
  otp: (request_id) => `otp_${request_id}`,
  forgetPassOTP: (email_id) => `password_OTP_${email_id}`,
};

module.exports = generateRedisKeyNames;
