import { UniqueConstraintError, ValidationError } from "sequelize";
import HttpError from "../helpers/HttpError.js";

/**
 * Middleware decorator for wrapping service functions.
 * Returns a middleware function that calls a service function with `id` and `body` parameters
 * derived from the request.
 * Handles errors by passing them to the next middleware.
 * Stores the result of the service function in `req.serviceMiddlewareArtifact`.
 *
 * @param {Function} serviceFunc The service function to be wrapped.
 * @returns {Function} Middleware function for Express.js.
 * @throws {HttpError} Throws an `HttpError` if a validation error or other error occurs.
 */

/**
 * Middleware decorator for wrapping service functions.
 * Returns a middleware function that calls a service function with `id` and `body` parameters
 * derived from the request.
 *
 * If the `req.user` object is present, the `owner` field is set in the `body` with the ID from `req.user`.
 * This allows the service function to receive the user ID for operations requiring ownership context.
 *
 * The middleware handles errors by passing them to the next middleware
 * and stores the result of the service function in `req.serviceMiddlewareArtifact`.
 *
 * @param {Function} serviceFunc The service function to be wrapped. It should accept two parameters:
 *   - `id` (number): The ID parameter from the request.
 *   - `body` (object): The request body, which may include an `owner` field if `req.user` is present.
 * @returns {Function} Middleware function for Express.js. This middleware:
 *   - Extracts the `id` from `req.params`.
 *   - Adds the `owner` field to the body with `req.user.id` if `req.user` is available.
 *   - Passes the result of the service function to `req.serviceMiddlewareArtifact`.
 * @throws {HttpError} Throws an `HttpError` if a validation error or other error occurs.
 *   - **400 Bad Request**: When a validation error occurs on the database side.
 *   - **409 Conflict**: When a unique constraint error occurs on the database side.
 *   - **500 Internal Server Error**: For other errors.
 */
const serviceWrapper = serviceFunc => {
  return async (req, _, next) => {
    let result;
    try {
      const body = { ...req.body };
      if (req.user) {
        body.owner = req.user.id;
      }
      result = await serviceFunc(req.params.id, body);
    } catch (err) {
      // unique value constraint error on database side
      if (err instanceof UniqueConstraintError) {
        const [{ path }] = err.errors;
        const itemName = path.charAt(0).toUpperCase() + path.slice(1);
        return next(
          new HttpError(409, {
            message: `${itemName} in use`,
            details: `${err.message}: The '${path}' field has a unique constraint and the provided value already exists in the database`,
          })
        );
      }
      // validation error on database side
      if (err instanceof ValidationError) {
        return next(
          new HttpError(400, {
            message: err.message,
            details:
              "Error occurred during the service function call to process the database request",
          })
        );
      }
      // thrown custom http error
      if (err instanceof HttpError) {
        return next(err);
      }
      // other error types
      return next(new HttpError(500, { details: `error: ${err.message}` }));
    }
    req.serviceMiddlewareArtifact = result;

    next();
  };
};

export default serviceWrapper;
