import HttpError from "../helpers/HttpError.js";

/**
 * Enum-like object defining argument options for service functions.
 *
 * @readonly
 * @property {string} ID Represents an argument where only the ID is provided.
 * @property {string} BODY Represents an argument where only the body is provided.
 * @property {string} ID_AND_BODY Represents an argument where both the ID and body are provided.
 */
export const FUNC_ARGS = Object.freeze({
  ID: "id as an argument",
  BODY: "body as an argument",
  ID_AND_BODY: "id and body in common object as an argument",
});

/**
 * Middleware decorator for wrapping service functions.
 * Returns a middleware function that calls a service function with parameters
 * derived from the request based on the specified argument type.
 * Handles errors by passing an HTTP 500 error to the next middleware.
 * Stores the result of the service function in `req.serviceMiddlewareArtifact`.
 *
 * @param {Function} serviceFunc The service function to be wrapped.
 * @param {string} funcArg Specifies how the service function should be called.
 * Valid values are:
 *   - `FUNC_ARGS.ID`: Call service function with request ID from params.
 *   - `FUNC_ARGS.BODY`: Call service function with request BODY.
 *   - `FUNC_ARGS.ID_AND_BODY`: Call service function with both request ID and BODY.
 *   - Default: Call service function without arguments.
 *
 * @returns {Function} Middleware function for Express.js.
 */
const serviceWrapper = (serviceFunc, funcArg) => {
  return async (req, _, next) => {
    let result;
    try {
      switch (funcArg) {
        case FUNC_ARGS.ID:
          result = await serviceFunc(req.params.id);
          break;
        case FUNC_ARGS.BODY:
          result = await serviceFunc({ ...req.body });
          break;
        case FUNC_ARGS.ID_AND_BODY:
          result = await serviceFunc({ id: req.params.id, ...req.body });
          break;
        default:
          result = await serviceFunc();
      }
    } catch (err) {
      return next(HttpError(500, { details: err.message }));
    }
    req.serviceMiddlewareArtifact = result;
    next();
  };
};

export default serviceWrapper;
