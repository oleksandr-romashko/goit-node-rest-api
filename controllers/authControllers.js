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
 * @property {Object} req.serviceMiddlewareArtifact The object containing the user details.
 * @property {string} req.serviceMiddlewareArtifact.email The email address of the newly registered user.
 * @property {string} req.serviceMiddlewareArtifact.subscription The subscription type of the newly registered user.
 *
 * @returns {void} Sends a JSON response with the registered user's details.
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

export default {
  registerUser,
};
