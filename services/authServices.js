import bcrypt from "bcryptjs";

import User from "../db/models/User.js";

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
  let createdUser;
  try {
    const { password } = data;
    const hashPassword = await bcrypt.hash(password, 10);
    createdUser = await User.create({ ...data, password: hashPassword });
  } catch (error) {
    error.message = `Error: while adding a new user: ${error.message}`;
    throw error;
  }
  return createdUser;
}

export default {
  registerUser,
};
