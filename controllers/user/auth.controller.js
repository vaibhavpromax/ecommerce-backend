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
const amazonService = require("../../services/amazon");
const redisHelper = require("../../helpers/redis");
const htmlTemplates = require("../../utils/htmlTemplates");
const logger = require("../../utils/logger");
const User = db.User;

const register = async (req, res) => {
  const { email, password, phone_no, first_name, last_name, username, gender } =
    req.body;
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
              phone_no: phone_no,
              username: username,
              password: passwordHash,
              gender: gender,
            })
              .then((us) => {
                const token = jwt.sign({ user: us?.dataValues }, "secret", {
                  expiresIn: "72h",
                });
                successResponse(res, "User created successfully", {
                  token: token,
                  user: us?.dataValues,
                });
              })
              .catch((err) => {
                console.log(err);
                serverErrorResponse(res, "error while creating the user");
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
      console.log("error", err);
    });
};

const login = (req, res, next) => {
  const { password, email } = req.body;
  // checks if email exists
  User.findOne({
    where: {
      email: email,
    },
  })
    .then((dbUser) => {
      if (!dbUser) {
        notFoundResponse(res, "user not found");
      } else {
        // password hash
        bcrypt.compare(password, dbUser.password, (err, compareRes) => {
          if (err) {
            // error while comparing
            serverErrorResponse(res, "error while comparing the password");
          } else if (compareRes) {
            // password match
            const token = jwt.sign({ user: dbUser }, "secret", {
              expiresIn: "72h",
            });
            successResponse(res, "User logged in successfully", {
              token: token,
              user: dbUser,
            });
          } else {
            // password doesnt match
            unauthorizedResponse(res, "password doesnt match");
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
    const [mailSent, emailErr] = await amazonService.sendHtmlMails({
      emailsToSend: [email],
      subject: "Ungraindanslaboite - Forget Password",
      body: htmlTemplates.forgetPassword({ code }),
    });
    if (emailErr) {
      logger.error(`Error in sending forgot password reset email ${emailErr}`);
      return badRequestResponse(res, emailErr);
    }

    // Store the email and code in Redis with a 3-minute expiration

    //set access_token in redis
    const [setAccessToken, setAccessTokenErr] = await redisHelper.setWithExpiry(
      generateRedisKeyNames.forgetPassOTP(email),
      code,
      180
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
    serverErrorResponse(res, err.message);
  }
};

const verifyOTP = async (req, res) => {
  const { email, OTP } = req.body;

  try {
    const [redisValue, redisErr] = await redisHelper.getValue(
      generateRedisKeyNames.forgetPassOTP(email)
    );
    console.log(redisValue);
    // if (redisErr) return [null, redisErr];
    if (redisValue === null)
      return unauthorizedResponse(res, "OTP is not valid");

    if (parseInt(OTP) !== parseInt(redisValue))
      return unauthorizedResponse(res, `Invalid OTP`);

    // const [user, userErr] = await Repository.fetchOne({
    //   tableName: DB_TABLES.USER,
    //   query: {
    //     primary_email: email,
    //   },
    // });
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user === NULL)
      return badRequestResponse(res, "User with primary email does not exist.");

    // generate token
    // const accessToken = jwtHelper.generate({
    //   user_id: user.user_id,
    //   first_name: user.first_name,
    //   role: user.role,
    //   primary_email: user.primary_email,
    //   company_id: user.company_id,
    // });

    const accessToken = jwt.sign({ user: user }, "secret", {
      expiresIn: "72h",
    });

    delete user.password;
    delete user.created_at;
    delete user.updated_at;

    return successResponse(res, "OTP is valid", { ...user, accessToken });
  } catch (err) {
    logger.error(err.message);
    serverErrorResponse(res, err.message);
  }
};

const isAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return unauthorizedResponse(res, "unauthorized");
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secret");
    req.user = decodedToken.user;
  } catch (err) {
    return serverErrorResponse(res, "could not decode the token");
  }
  if (!decodedToken) {
    unauthorizedResponse(res, "unauthorized");
  } else {
    // res.status(200).json({ message: "here is your resource" });
    next();
  }
};

module.exports = {
  register,
  isAuth,
  login,
  forgetPassword,
  verifyOTP,
};
