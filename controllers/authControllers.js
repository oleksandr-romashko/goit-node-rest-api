import * as fs from "node:fs/promises";
import path from "node:path";

import {
  defaultPublicFolderName,
  defaultRelAvatarFolderPath,
  defaultAvatarFileName,
} from "../constants/authConstants.js";

import authServices from "../services/authServices.js";
import { emailConfirmationHtml } from "../constants/emailTemplates.js";
import { sendEmail } from "../services/emailService.js";
import HttpError from "../helpers/HttpError.js";

const avatarsFolderAbsPath = path.resolve(
  defaultPublicFolderName,
  ...defaultRelAvatarFolderPath
);

/**
 * Controller to handle the request to register a new user.
 * It retrieves the newly registered user's details from the request variable
 * saved by the previous middleware and sends them in the response.
 *
 * The response includes:
 * - `user`: An object containing the user's email and subscription type.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const registerUser = (req, res) => {
  const { email, subscription } = req.serviceMiddlewareArtifact;
  res.status(201).json({
    user: {
      email,
      subscription,
    },
  });
};

/**
 * Controller to handle the request to log in a user.
 * It retrieves the user's details from the request variable
 * saved by the previous middleware and sends them in the response.
 *
 * The response includes the user details.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const loginUser = (req, res) => {
  const user = req.serviceMiddlewareArtifact;
  res.json(user);
};

/**
 * Controller to handle the request to log out a user.
 * This function sends a 204 No Content response, indicating
 * that the request was successful but there is no content to send in the response.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const logoutUser = async (req, res) => {
  const { id } = req.user;
  await authServices.updateUser(id, { token: null });
  res.status(204).end();
};

/**
 * Controller to handle the request to get the current user's details.
 * It retrieves the user's details from the request variable
 * (populated by an authentication middleware) and sends them in the response.
 *
 * The response includes:
 * - `email`: The email of the currently authenticated user.
 * - `subscription`: The subscription type of the currently authenticated user.
 * - `avatarUrl`: The avatar URL of the currently authenticated user.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const getCurrent = (req, res) => {
  const { email, subscription, avatarUrl } = req.user;
  res.json({
    email,
    subscription,
    avatarUrl,
  });
};

/**
 * Controller to handle the request to update the user's avatar.
 * This function moves the uploaded avatar file from a temporary folder to
 * the final destination, updates the user's record with the new avatar path,
 * and removes the old avatar file if it is not the default avatar.
 *
 * @param {Object} req Express request object.
 * @param {Object} req.file Contains information about the uploaded file.
 * @param {Object} req.user The authenticated user's data.
 * @param {Object} res Express response object.
 *
 * @throws {Error} Throws an error if there is an issue moving the file or updating the user record.
 */
const updateAvatar = async (req, res) => {
  // Move avatar file from `temp` folder to `avatars` folder
  const { path: oldAbsTempPath, filename } = req.file;
  const newAbsAvatarPath = path.join(avatarsFolderAbsPath, filename);
  try {
    await fs.rename(oldAbsTempPath, newAbsAvatarPath);
  } catch (error) {
    error.message = `Error: while moving user avatar file '${filename}' from '${oldAbsTempPath}' to '${avatarsFolderAbsPath}'`;
  }

  // Obtain old user avatar absolute path for future deletion
  const oldAvatarAbsPath = path.resolve(req.user.dataValues.avatarURL);

  // Update user with new avatar relative path
  const newRelPath = path.join(...defaultRelAvatarFolderPath, filename);
  const { avatarURL } = await authServices.updateUser(req.user.id, {
    avatarURL: newRelPath,
  });

  // Clean-up - remove old user avatar file if not default avatar
  const defaultAbsAvatarPath = path.resolve(
    ...defaultRelAvatarFolderPath,
    defaultAvatarFileName
  );
  if (oldAvatarAbsPath !== defaultAbsAvatarPath) {
    // Attempt to delete the old avatar file.
    // Full error handling is implemented to ensure that the process continues
    // even if an error occurs during the file deletion.
    try {
      await fs.unlink(oldAvatarAbsPath);
    } catch (error) {
      if (error.code === "ENOENT") {
        // File does not exist
        console.error("File not found");
      } else if (error.code === "EACCES") {
        // Permission denied
        console.error("Permission denied");
      } else {
        // Other errors
        console.error(`Error deleting file: ${error.message}`);
      }
    }
  }

  // Sent response with updated avatar URL data
  res.json({
    avatarURL,
  });
};

/**
 * Controller to handle email verification requests.
 * It verifies the user's email based on the verification token
 * provided in the request parameters.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express next middleware function.
 *
 * @throws {HttpError} Throws an error if the user is not found or the email has already been confirmed.
 */
const verify = async (req, res, next) => {
  // Retrieve verification token from request
  const { verificationToken } = req.params;

  // Find user related with obtained verification token
  const user = await authServices.getUser({ verificationToken });
  if (!user) {
    return next(
      new HttpError(404, {
        message: "User not found",
        details: `User with the verification token '${verificationToken}' not found or the email has already been confirmed.`,
      })
    );
  }

  // Mark user email as verified
  await authServices.updateUser(user.id, {
    verify: true,
    verificationToken: null,
  });

  // Reply with success message
  res.json({
    message: "Verification successful",
  });
};

/**
 * Controller to handle requests to resend the email verification.
 * It resends a verification email to the user's email address.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express next middleware function.
 *
 * @throws {HttpError} Throws an error if the user is not found or the email has already been verified.
 */
const resendVerify = async (req, res, next) => {
  // Retrieve email from request
  const { email } = req.body;

  // Find user related with obtained email
  const user = await authServices.getUser({ email });
  if (!user) {
    return next(
      new HttpError(404, {
        message: "User not found",
        details: `User with the email '${email}' not found.`,
      })
    );
  }

  // Check whether the user's email has already been verified
  if (user.verify === true) {
    return next(
      new HttpError(400, {
        message: "Verification has already been passed",
      })
    );
  }

  // Resend a verification email to the user's email address for email verification
  await sendEmail({
    to: email,
    subject: "Resent: Confirm Your Email Address",
    html: emailConfirmationHtml(
      `${process.env.BASE_URL}/api/auth/verify/${user.verificationToken}`,
      true
    ),
  });

  // Reply with success message
  res.json({
    message: "Verification email sent",
  });
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  getCurrent,
  updateAvatar,
  verify,
  resendVerify,
};
