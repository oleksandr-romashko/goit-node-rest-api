import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import path from "node:path";

import {
  defaultRelAvatarFolderPath,
  defaultAvatarFileName,
  jwtTokenExpirationTime,
  avatarFallbackUrl,
} from "../constants/authConstants.js";

import User from "../db/models/User.js";
import { getGravatarUrl } from "../helpers/generateGravatar.js";
import validateImageUrl from "../helpers/checkImageUrl.js";
import { sendEmail } from "./emailService.js";
import { emailConfirmationHtml } from "../constants/emailTemplates.js";
import HttpError from "../helpers/HttpError.js";

const { JWT_SECRET_KEY, BASE_URL } = process.env;

/**
 * Registers a new user.
 *
 * @param {object} data The data for the new user.
 * @param {string} data.password The plain text password of the user.
 * @returns {object} The newly registered user object with selected keys.
 * @throws {Error} Throws an error if the user registration fails, with details
 * about the failure.
 */
async function registerUser(_, data) {
  let avatarURL;

  try {
    // Try Gravatar URL for valid image
    const gravatarUrlToCheck = await getGravatarUrl(data.email);
    if (await validateImageUrl(gravatarUrlToCheck)) {
      avatarURL = gravatarUrlToCheck;
    } else if (await validateImageUrl(avatarFallbackUrl)) {
      // Try fallback URL
      avatarURL = avatarFallbackUrl;
    }
  } catch {
    console.error("Error occurred while checking avatar URLs", error);
  }

  if (!avatarURL) {
    // Both main URL checks failed
    // Fallback to a local avatar file and provide its relative path in public folder
    avatarURL = path.join(...defaultRelAvatarFolderPath, defaultAvatarFileName);
  }

  // Hash password in request
  let hashPassword;
  try {
    hashPassword = await bcrypt.hash(data.password, 10);
  } catch (error) {
    error.message = `Error: while registering user and failed to hash password: ${error.message}`;
    throw error;
  }

  // Create verification token that will be used for user email verification
  const verificationToken = uuidv4();

  // Add user to database with hashed password and avatar URL
  let registeredUser;
  try {
    registeredUser = await User.create({
      ...data,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });
  } catch (error) {
    error.message = `Error: while registering user and creating a new user: ${error.message}`;
    throw error;
  }

  // Send a verification email to the user's email address for email verification
  await sendEmail({
    to: registeredUser.email,
    subject: "Confirm Your Email Address",
    html: emailConfirmationHtml(
      `${BASE_URL}/api/auth/verify/${verificationToken}`,
      false
    ),
  });

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
async function loginUser(_, { email, password } = {}) {
  // Find user in database based on email
  let user;
  try {
    user = await User.findOne({
      attributes: { exclude: ["updatedAt", "createdAt"] },
      where: { email },
    });
  } catch (error) {
    error.message = `Error: while login user and finding existing user: ${error.message}`;
    throw error;
  }

  // Check that a user with the specified email exists
  if (!user) {
    throw new HttpError(401, {
      message: "Email or password is wrong",
      details:
        "The provided credentials do not match any existing user records",
    });
  }

  // Check that the user's email is verified
  if (!user.verify) {
    throw new HttpError(401, {
      message: "Email is not verified",
      details: `Email can be verified by following the link sent to the user's email address, which contains the verification token.`,
    });
  }

  // Check that the user passwords match
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

  // Create JWT token for user using secret key
  let token;
  try {
    const payload = {
      id: user.id,
    };
    token = jwt.sign(payload, JWT_SECRET_KEY, {
      expiresIn: jwtTokenExpirationTime,
    });
  } catch (error) {
    error.message = `Error: An issue occurred while generating the authentication token: ${error.message}`;
    throw error;
  }

  // Update the user record with the new token
  try {
    user = await updateUser(user.id, { token });
  } catch (error) {
    error.message = `Error while saving token to user: ${error.message}`;
    throw error;
  }

  // Return response object containing token and user data
  return {
    token: user.token,
    user: {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    },
  };
}

/**
 * Retrieves a user based on a query object.
 *
 * @param {object} query The query object used to find the user.
 * It can include fields such as `id` or other criteria.
 * @returns {object|null} The user object if found, otherwise null.
 * @throws {Error} Throws an error if there is an issue retrieving the user, with details
 * about the failure.
 */
async function getUser(query) {
  let user;
  try {
    user = await User.findOne({
      attributes: { exclude: ["updatedAt", "createdAt"] },
      where: query,
    });
  } catch (error) {
    error.message = `Failed to retrieve user: ${error.message}`;
    throw error;
  }

  return user || null;
}

/**
 * Updates user.
 *
 * @param {number} id The ID of the user to update.
 * @param {object} data The new data for the user.
 * @returns {object|null} The updated user object if the update was successful, otherwise null.
 * @throws {HttpError} Throws an error if the update fails, with details about the failure.
 */
async function updateUser(id, data) {
  let affectedRows;
  try {
    [affectedRows] = await User.update(data, { where: { id } });
  } catch (error) {
    error.message = `Error: while updating user with ID '${id}': ${error.message}`;
    throw error;
  }
  const updatedUser = await getUser({ id });
  if (!affectedRows && updatedUser) {
    throw new HttpError(400, {
      message:
        "Nothing to update or update was not effective while updating user",
      details: `number of affected rows is ${affectedRows}`,
    });
  }
  if (!updatedUser) {
    return null;
  }
  return updatedUser;
}

export default {
  registerUser,
  loginUser,
  getUser,
  updateUser,
};
