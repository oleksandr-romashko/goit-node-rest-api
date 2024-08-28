import HttpError from "../helpers/HttpError.js";

/**
 * Middleware decorator for wrapping service functions.
 * Returns a middleware function that invokes a service function with `id` and
 * `body` extracted from the request.
 * If an error occurs during the service function call, it passes
 * a custom HTTP error object to the next middleware.
 * The result of the service function is stored in `req.serviceMiddlewareArtifact`.
 *
 * @param {Function} serviceFunc The service function to be wrapped.
 * The service function should accept two parameters:
 * - the `id` from `req.params`
 * - and the spread `req.body` object.
 *
 * @returns {Function} Middleware function for Express.js.
 */
const serviceWrapper = serviceFunc => {
  return async (req, _, next) => {
    let result;
    try {
      result = await serviceFunc(req.params.id, { ...req.body });
    } catch (err) {
      return next(HttpError(500, { details: err.message }));
    }
    req.serviceMiddlewareArtifact = result;
    next();
  };
};

export default serviceWrapper;
