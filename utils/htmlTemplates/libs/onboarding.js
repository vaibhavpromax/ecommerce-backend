const onboarding = ({ first_name, last_name }) => {
  return `<div>Hello ${first_name} ${last_name}, <br/>

    Please verify your email in order to start using <a href="https://thesales.io">thesales.io</a>.
    <br/><br/>
    Thank you,
    <br/>
    Team TheSales</div>`;
};

module.exports = onboarding;
