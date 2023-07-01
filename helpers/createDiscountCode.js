const coupongenerator = () => {
  var coupon = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < 8; i++) {
    coupon += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return coupon;
};
module.exports = coupongenerator;
