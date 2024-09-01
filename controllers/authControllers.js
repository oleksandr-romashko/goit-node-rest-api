import * as fs from "node:fs/promises";
import path from "node:path";

import {
  defaultPublicFolderName,
  defaultRelAvatarFolderPath,
  defaultAvatarFileName,
} from "../constants/authConstants.js";

import authServices from "../services/authServices.js";

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
  const newRelPath = path.join(
    defaultPublicFolderName,
    ...defaultRelAvatarFolderPath,
    filename
  );
  const { avatarURL } = await authServices.updateUser(req.user.id, {
    avatarURL: newRelPath,
  });

  // Clean-up - remove old user avatar file if not default avatar
  const defaultAbsAvatarPath = path.resolve(
    ...defaultRelAvatarFolderPath,
    defaultAvatarFileName
  );
  if (oldAvatarAbsPath !== defaultAbsAvatarPath) {
    // Asynchronous method with full error handling
    try {
      fs.unlink(oldAvatarAbsPath);
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

export default {
  registerUser,
  loginUser,
  logoutUser,
  getCurrent,
  updateAvatar,
};
