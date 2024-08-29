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
  const contact = req.serviceMiddlewareArtifact;
  res.json(contact);
};

export default {
  registerUser,
  loginUser,
};
