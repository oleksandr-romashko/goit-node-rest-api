/**
 * List of default error messages corresponding to common HTTP status codes.
 * Each key represents an HTTP status code, and its associated default error message.
 */
const messageList = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  500: "Internal Server Error",
};

/**
 * Creates an HTTP error wrapped around Error with a custom message
 * and optional details.
 *
 * @param {number} status The HTTP status code for the error (e.g., 404, 500).
 * @param {Object} [options={}] Optional parameters to customize the error.
 * @param {string} [options.message=messageList[status]] Custom error message. Defaults to a message based on the status code.
 * @param {string} [options.details] Additional details about the error.
 * @returns {Error} The error object with a custom message, status code, and optional details.
 */
const HttpError = (status, { message = messageList[status], details } = {}) => {
  const error = new Error(message);
  error.status = status;
  if (details) {
    error.details = details;
  }
  return error;
};

export default HttpError;
