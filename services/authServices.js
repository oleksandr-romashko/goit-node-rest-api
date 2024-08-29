import bcrypt from "bcryptjs";
import "dotenv/config";
import jwt from "jsonwebtoken";

import User from "../db/models/User.js";
import HttpError from "../helpers/HttpError.js";

const { JWT_SECRET_KEY } = process.env;

/**
 * Registers a new user.
 *
 * @param {object} data The data for the new user.
 * @param {string} data.password The plain text password of the user.
 * @returns {object} The newly registered user object.
 * @throws {Error} Throws an error if the user registration fails, with details
 * about the failure.
 */
async function registerUser(_, data) {
  let hashPassword;
  try {
    hashPassword = await bcrypt.hash(data.password, 10);
  } catch (error) {
    error.message = `Error: while registering user and failed to hash password: ${error.message}`;
    throw error;
  }

  let registeredUser;
  try {
    registeredUser = await User.create({ ...data, password: hashPassword });
  } catch (error) {
    error.message = `Error: while registering user and creating a new user: ${error.message}`;
    throw error;
  }
  return registeredUser;
}

/**
 * Logs in an existing user.
 *
 * @param {object} data The login credentials for the user.
 * @param {string} data.email The email address of the user.
 * @param {string} data.password The plain text password of the user.
 * @returns {object} The logged-in user object along with a JWT token.
 * @throws {Error | HttpError} Throws an error if the login fails, with details
 * about the failure.
 */
async function loginUser(_, { email, password }) {
  let user;
  try {
    user = await User.findOne({ where: { email } });
  } catch (error) {
    error.message = `Error: while login user and finding existing user: ${error.message}`;
    throw error;
  }
  if (!user) {
    throw new HttpError(401, {
      message: "Email or password is wrong",
      details:
        "The provided credentials do not match any existing user records",
    });
  }

  let passwordCompare;
  try {
    passwordCompare = await bcrypt.compare(password, user.password);
  } catch (error) {
    error.message = `Error: while comparing passwords: ${error.message}`;
    throw error;
  }
  if (!passwordCompare) {
    throw new HttpError(401, {
      message: "Email or password is wrong",
      details: "The provided password does not match record for this email",
    });
  }

  let token;
  try {
    const payload = {
      id: user.id,
    };
    token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "23h" });
  } catch (error) {
    error.message = `Error: An issue occurred while generating the authentication token: ${error.message}`;
    throw error;
  }

  return {
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };
}

export default {
  registerUser,
  loginUser,
};
