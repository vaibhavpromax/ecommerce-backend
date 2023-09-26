const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../db/models");
const {
  successResponse,
  serverErrorResponse,
  badRequestResponse,
  notFoundResponse,
  unauthorizedResponse,
} = require("../../utils/response");
const logger = require("../../utils/logger");

const Admin = db.Admin;

const login_admin = (req, res) => {
  const { password, email } = req.body;
  // checks if email exists
  Admin.findOne({
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
              admin_id: dbUser.admin_id,
            };

            // password match
            const token = jwt.sign({ admin: tokenPayload }, "secret");
            return successResponse(res, "Admin logged in successfully", {
              token: token,
              admin: tokenPayload,
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

const register_admin = async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  // check if user already exists
  Admin.findOne({
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
            return Admin.create({
              email: email,
              first_name: first_name,
              last_name: last_name,
              password: passwordHash,
            })
              .then(async (us) => {
                const parsedAdmin = JSON.parse(JSON.stringify(us));
                const tokenPayload = {
                  first_name: parsedAdmin.first_name,
                  last_name: parsedAdmin.last_name,
                  admin_id: parsedAdmin.admin_id,
                };

                const token = jwt.sign({ admin: tokenPayload }, "secret");

                return successResponse(res, "Admin created successfully", {
                  token: token,
                  admin: tokenPayload,
                });
              })
              .catch((err) => {
                console.log(err);
                return serverErrorResponse(
                  res,
                  "error while creating the Admin"
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

const adminAuthMiddleware = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return unauthorizedResponse(res, "unauthorized");
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secret");
    console.log(decodedToken);
    // decodedToken has the value of admin stored on the local storage
    req.admin = decodedToken.admin;
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

const changeAdminPassword = async (req, res) => {
  const { admin_id } = req.admin;
  const { current_pass, new_pass } = req.body;

  try {
    const dbAdmin = await Admin.findOne({ where: { admin_id } });

    bcrypt.compare(current_pass, dbAdmin.password, (err, compareRes) => {
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
            const updated_admin = await Admin.update(
              { password: passwordHash },
              { where: { admin_id } }
            );
            if (updated_admin.length === 1)
              return successResponse(res, "Password changed successfully");
            else
              return serverErrorResponse(res, "Error while changing password");
          }
        });
      }
    });
  } catch (error) {
    logger.error(`Error while changing password ${error}`);
    return serverErrorResponse(res, "Error while changing the password");
  }
};

module.exports = {
  register_admin,
  changeAdminPassword,
  login_admin,
  adminAuthMiddleware,
};
