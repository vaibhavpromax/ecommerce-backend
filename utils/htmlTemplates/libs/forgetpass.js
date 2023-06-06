const forgetPasswordEmail = ({ code }) => {
  return `<div>Hello, <br/>
      <br/>Here is your 6 digits code for password reset ${code}.<br/>
      <br/>This code is valid for next 3 minutes.<br/>
      <br/><br/>
      Thank you,
      <br/>
      Ungraindanslaboite</div>`;
};

module.exports = forgetPasswordEmail;
