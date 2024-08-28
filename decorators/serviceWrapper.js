import { ValidationError } from "sequelize";
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
const serviceWrapper = serviceFunc => {
  return async (req, _, next) => {
    let result;
    try {
      result = await serviceFunc(req.params.id, { ...req.body });
    } catch (err) {
      if (err instanceof ValidationError) {
        return next(
          new HttpError(400, {
            message: err.message,
            details:
              "error provided by database service function call while processing database request",
          })
        );
      }
      if (err instanceof HttpError) {
        return next(err);
      }
      return next(new HttpError(500, { details: `error: ${err.message}` }));
    }
    req.serviceMiddlewareArtifact = result;
    next();
  };
};

export default serviceWrapper;
