const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../db/models");
const {
  serverErrorResponse,
  successResponse,
  badRequestResponse,
  notFoundResponse,
  unauthorizedResponse,
} = require("../../utils/response");
const moment = require("moment");
const redisHelper = require("../../helpers/redis");
const htmlTemplates = require("../../utils/htmlTemplates");
const logger = require("../../utils/logger");
const generateRedisKeyNames = require("../../utils/rediskeynames");
const amazonService = require("../../services/amazon");

//modles
const Referral = db.Referral;
const User = db.User;
const Discount = db.Discount;
const Session = db.Session;
const CartItem = db.CartItem;
const Cart = db.Cart;
const Wishlist = db.Wishlist;

const register = async (req, res) => {
  const { user_id, session_id } = req.user;

  const {
    email,
    password,
    // phone_no,
    first_name,
    last_name,
    // username,
    // gender,
    referral_code,
  } = req.body;

  const [redisValue, redisErr] = await redisHelper.getValue(
    generateRedisKeyNames.referralCode(referral_code)
  );
  if (referral_code) {
    // check if the referral code exists or not
    if (redisValue === null)
      return badRequestResponse(res, "Referral code is not valid is not valid");
  }
  // check if user already exists
  User.findOne({
    where: {
      email: email,
    },
  })
    .then((dbUser) => {
      if (dbUser) {
        return serverErrorResponse(res, "Email already exists");
      } else if (email && password) {
        // password hash
        bcrypt.hash(password, 12, (err, passwordHash) => {
          if (err) {
            return serverErrorResponse(res, "error while hashing the password");
          } else if (passwordHash) {
            return User.create({
              email: email,
              first_name: first_name,
              last_name: last_name,
              phone_no: "3479287408",
              username: "testuser",
              password: passwordHash,
              referral_id: redisValue,
            })
              .then(async (us) => {
                const parsedUser = JSON.parse(JSON.stringify(us));
                const tokenPayload = {
                  first_name: parsedUser.first_name,
                  last_name: parsedUser.last_name,
                  user_name: parsedUser.user_name,
                  user_id: parsedUser.user_id,
                  is_authenticated: true,
                };
                const updateUser = async () => {
                  // update cart with the user_id
                  const updated_cart = await Cart.update(
                    { user_id: us.user_id },
                    { where: { session_id: session_id } }
                  );
                  logger.info(`Cart users  updated ${updated_cart}`);
                  //update cart items with user_id
                  const updated_cart_items = await CartItem.update(
                    { user_id: us.user_id },
                    { where: { session_id: session_id } }
                  );
                  logger.info(`CartItem users  updated ${updated_cart_items}`);

                  //update wishlist with user_id
                  const updated_wishlist = await Wishlist.update(
                    { user_id: us.user_id },
                    { where: { user_id: session_id } }
                  );
                  logger.info(`Cart wishlist updated ${updated_wishlist}`);
                };

                updateUser();

                const token = jwt.sign({ user: tokenPayload }, "secret", {
                  expiresIn: "72h",
                });

                if (referral_code != null) {
                  // update the referral table with the person who is referred
                  try {
                    const updated_rows = await Referral.update(
                      {
                        referred_to: us["dataValues"].user_id,
                      },
                      {
                        where: {
                          referral_id: redisValue,
                        },
                      }
                    );
                    logger.info("Referral updated in the table");
                  } catch (err) {
                    logger.error(`Referrals not updated ${err}`);
                  }

                  // create a discount row for new user
                  const timeOneMonthAhead = moment().add(1, "month").unix();
                  try {
                    const reff_discount = await Discount.create({
                      value: 20,
                      is_percent: yes,
                      expiryDate: timeOneMonthAhead,
                      isActive: true,
                      code: null,
                    });
                    logger.info(
                      `Discount row created for referral ${reff_discount}`
                    );
                  } catch (error) {
                    logger.error(
                      `Discount row not created for referral ${error}`
                    );
                  }
                }
                return successResponse(res, "User created successfully", {
                  token: token,
                  user: tokenPayload,
                });
              })
              .catch((err) => {
                console.log(err);
                return serverErrorResponse(
                  res,
                  "error while creating the user"
                );
              });
          }
        });
      } else if (!password) {
        return badRequestResponse(res, "password not provided");
      } else if (!email) {
        return badRequestResponse(res, "email not provided");
      }
    })
    .catch((err) => {
      logger.error(err);
    });
};

const login = (req, res, next) => {
  const { user_id, session_id } = req.user;
  const { password, email } = req.body;
  // checks if email exists
  User.findOne({
    where: {
      email: email,
    },
  })
    .then(async (dbUser) => {
      if (!dbUser) {
        return notFoundResponse(res, "user not found");
      } else {
        // password hash
        bcrypt.compare(password, dbUser.password, (err, compareRes) => {
          if (err) {
            // error while comparing
            return serverErrorResponse(
              res,
              "error while comparing the password"
            );
          } else if (compareRes) {
            const tokenPayload = {
              first_name: dbUser.first_name,
              last_name: dbUser.last_name,
              user_name: dbUser.user_name,
              user_id: dbUser.user_id,
              is_authenticated: true,
            };

            const updateUser = async () => {
              // update cart with the user_id
              const updated_cart = await Cart.update(
                { user_id: dbUser.user_id },
                { where: { session_id: session_id } }
              );
              logger.info(`Cart users  updated ${updated_cart}`);
              //update cart items with user_id
              const updated_cart_items = await CartItem.update(
                { user_id: dbUser.user_id },
                { where: { session_id: session_id } }
              );
              logger.info(`CartItem users  updated ${updated_cart_items}`);

              //update wishlist with user_id
              const updated_wishlist = await Wishlist.update(
                { user_id: dbUser.user_id },
                { where: { user_id: session_id } }
              );
              logger.info(`Cart wishlist updated ${updated_wishlist}`);
            };

            updateUser();

            // password match
            const token = jwt.sign({ user: tokenPayload }, "secret", {
              expiresIn: "72h",
            });
            return successResponse(res, "User logged in successfully", {
              token: token,
              user: tokenPayload,
            });
          } else {
            // password doesnt match
            return unauthorizedResponse(res, "password doesnt match");
          }
        });
      }
    })
    .catch((err) => {
      console.log("error", err);
    });
};

//Forget password route
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    //Check if user exists
    const checkUser = await User.findOne({
      where: {
        email: email,
      },
    });

    //If email does not exist in Database
    if (checkUser === null)
      return serverErrorResponse(res, "No user found with the email ID");

    // Generate a random 6-digit code
    const code = Math.floor(Math.random() * 900000) + 100000;

    //Sending email
    const [mail, emailErr] = await amazonService.sendMails({
      emailsToSend: [email],
      subject: "Ungraindanslaboite - Forget Password",
      body: htmlTemplates.forgetPassword({ code }),
    });
    console.log(mail);
    if (emailErr) {
      logger.error(`Error in sending forgot password reset email ${emailErr}`);
      return badRequestResponse(res, emailErr);
    }

    //set access_token in redis with __ seconds of expiry time
    const [setAccessToken, setAccessTokenErr] = await redisHelper.setWithExpiry(
      generateRedisKeyNames.forgetPassOTP(email),
      code,
      3600
    );
    if (setAccessTokenErr)
      return badRequestResponse(res, "Error in saving OTP to redis.");

    logger.info(`Email with 6 digits code sent successfully to ${email}`);

    return successResponse(
      res,
      `Email with 6 digits code sent successfully to ${email}`
    );
  } catch (err) {
    logger.error(err.message);
    return serverErrorResponse(res, err.message);
  }
};

const verifyOTP = async (req, res) => {
  const { email, OTP } = req.body;

  try {
    const [redisValue, redisErr] = await redisHelper.getValue(
      generateRedisKeyNames.forgetPassOTP(email)
    );
    if (redisValue === null)
      return unauthorizedResponse(res, "OTP is not valid");

    if (parseInt(OTP) !== parseInt(redisValue))
      return unauthorizedResponse(res, `Invalid OTP`);

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user === null) return notFoundResponse(res, "User not found");

    const accessToken = jwt.sign({ user: user.dataValues }, "secret", {
      expiresIn: "72h",
    });

    delete user.password;
    delete user.created_at;
    delete user.updated_at;

    return successResponse(res, "OTP is valid", { ...user, accessToken });
  } catch (err) {
    logger.error(err.message);
    return serverErrorResponse(res, err.message);
  }
};

const changePassword = async (req, res) => {
  const { user_id } = req.user;
  const { current_pass, new_pass } = req.body;

  try {
    const dbUser = await User.findOne({ where: { user_id } });

    bcrypt.compare(current_pass, dbUser.password, (err, compareRes) => {
      if (err) {
        // error while comparing
        logger.error(`Error in comparing pas ${err}`);
        return serverErrorResponse(res, "Current password is incorrect");
      } else if (compareRes) {
        bcrypt.hash(new_pass, 12, async (err, passwordHash) => {
          if (err) {
            logger.error(`Error while generating new hash ${err}`);
            return serverErrorResponse(
              res,
              "error while hashing the new password"
            );
          } else if (passwordHash) {
            const updated_user = await User.update(
              { password: passwordHash },
              { where: { user_id } }
            );
            if (updated_user.length === 1)
              return successResponse(res, "Password changed successfully");
            else
              return serverErrorResponse(res, "Error while changing password");
          }
        });

        // // password match
        // const token = jwt.sign({ user: dbUser }, "secret", {
        //   expiresIn: "72h",
        // });
        // return successResponse(res, "User logged in successfully", {
        //   token: token,
        //   user: dbUser,
        // });
      }
    });
  } catch (error) {
    logger.error(`Error while changing password ${error}`);
    return serverErrorResponse(res, "Error while changing the password");
  }
};

const authMiddleware = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return unauthorizedResponse(res, "unauthorized");
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secret");
    console.log(decodedToken);
    if (decodedToken?.user?.is_authenticated)
      req.user = { user_id: decodedToken.user.user_id, session_id: null };
    else
      req.user = { session_id: decodedToken.session.session_id, user_id: null };
  } catch (err) {
    console.log(err);
    return serverErrorResponse(res, "could not decode the token");
  }
  if (!decodedToken) {
    return unauthorizedResponse(res, "unauthorized");
  } else {
    // res.status(200).json({ message: "here is your resource" });
    next();
  }
};

const makeSession = async (req, res) => {
  try {
    const session = await Session.create({});
    const sessionToken = jwt.sign({ session: session.dataValues }, "secret", {
      expiresIn: "72h",
    });

    logger.info(`session created with ${session.dataValues.session_id}`);
    return successResponse(res, "Session created", { token: sessionToken });
  } catch (error) {
    logger.error(`Error while creating a session ${error}`);
    return serverErrorResponse(res, "Error while creating a session");
  }
};

module.exports = {
  register,
  authMiddleware,
  login,
  changePassword,
  forgetPassword,
  verifyOTP,
  makeSession,
};
