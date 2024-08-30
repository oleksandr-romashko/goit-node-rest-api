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
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

export default {
  registerUser,
  loginUser,
  getCurrent,
};
