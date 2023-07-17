const generateRedisKeyNames = {
  otp: (request_id) => `otp_${request_id}`,
  forgetPassOTP: (email_id) => `password_OTP_${email_id}`,
  referralCode:(code)=>`referral_code_${code}`
};

module.exports = generateRedisKeyNames;
