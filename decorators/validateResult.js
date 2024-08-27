import HttpError from "../helpers/HttpError.js";

/**
 * Middleware decorator for validating service results.
 * Returns a middleware function that checks if a specific service result
 * was provided by the service and is present in the request.
 * If the result is not found, it passes an HTTP 404 error to the next middleware.
 * Otherwise, it calls `next()` to proceed to the next middleware.
 *
 * @returns {Function} Middleware function for Express.js.
 */
const validateResult = () => {
  return (req, _, next) => {
    const result = req.serviceMiddlewareArtifact;

    if (!result) {
      return next(
        new HttpError(404, {
          message: "Not found",
          details: `Contact with id '${req.params.id}' not found`,
        })
      );
    }
    next();
  };
};

export default validateResult;
