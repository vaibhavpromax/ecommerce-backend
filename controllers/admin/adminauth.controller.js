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
            const token = jwt.sign({ user: tokenPayload }, "secret", {
              expiresIn: "72h",
            });
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

                const token = jwt.sign({ user: tokenPayload }, "secret", {
                  expiresIn: "72h",
                });

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

    // decodedToken has the value of admin stored on the local storage

  
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

module.exports = {
  register_admin,
  login_admin,
  adminAuthMiddleware,
};
