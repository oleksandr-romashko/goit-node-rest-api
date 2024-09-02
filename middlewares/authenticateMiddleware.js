import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";
import authServices from "../services/authServices.js";

const { JWT_SECRET_KEY } = process.env;

/**
 * Middleware to authenticate a user by verifying their JWT token.
 *
 * This middleware performs the following steps:
 * 1. Checks if the authorization header contains a token.
 * 2. Ensures the token type is 'Bearer'.
 * 3. Verifies the token and extracts the user ID from the payload.
 * 4. Checks if the user associated with the token exists in the database
 * 5. Check if the user in the database has a token and compare it with the token in the request
 * 6. Assign user object to `req.user`.
 *
 * If any of these checks fail, an HTTP error with status 401 (Unauthorized)
 * is passed to the next middleware.
 *
 * @param {Object} req The request object.
 * @param {Object} _ The response object (not used).
 * @param {Function} next The next middleware function.
 *
 * @throws {HttpError} If the authorization header is missing, the token type
 * is not 'Bearer', the token is invalid, or the user is not found.
 */
const authenticate = async (req, _, next) => {
  const { authorization } = req.headers;

  // 1. Check if authorization header contains token
  if (!authorization) {
    return next(
      new HttpError(401, {
        message: "Not authorized",
        details:
          "Authorization token is missing. Please include a valid token in your request headers.",
      })
    );
  }

  // 2. Check if token has 'Bearer' type
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(
      new HttpError(401, {
        message: "Not authorized",
        details:
          "Unsupported token type. Ensure the token type is 'Bearer' and that the 'Bearer' identifier precedes the token.",
      })
    );
  }

  // 3. Retrieve id from decoded JWT token payload
  let id;
  try {
    const decodedPayload = jwt.verify(token, JWT_SECRET_KEY);
    id = decodedPayload.id;
  } catch (error) {
    console.log(error);
    const expiredAt = error.expiredAt ? `, expired at: ${error.expiredAt}` : "";
    return next(
      new HttpError(401, {
        message: "Not authorized",
        details: `Error while validating JWT token: ${error.message}${expiredAt}`,
      })
    );
  }

  // 4. Check if user is presented in database and assign it to `req.user`.
  const user = await authServices.getUser({ id });
  if (!user) {
    return next(
      new HttpError(401, {
        message: "Not authorized",
        details: `User with ID '${id}' specified in the JWT token was not found in the database.`,
      })
    );
  }

  // 5. Check if the user in the database has a token and compare it with the token in the request
  if (!user.token) {
    return next(
      new HttpError(401, {
        message: "Not authorized",
        details: `User with ID '${id}' has no token and is logged out.`,
      })
    );
  }

  if (user.token !== token) {
    return next(
      new HttpError(401, {
        message: "Not authorized",
        details: `User with ID '${id}' has a different token and does not have a valid token.`,
      })
    );
  }

  // 5. Assign user to `req.user` variable.
  req.user = user;

  next();
};

export default authenticate;
