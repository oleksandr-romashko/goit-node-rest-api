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
 * Custom error class for handling HTTP errors in an Express application.
 * Extends the native JavaScript `Error` class, adding an HTTP status code and optional details.
 */
class HttpError extends Error {
  /**
   * Creates an instance of `HttpError`.
   *
   * @param {number} [status=500] The HTTP status code for the error. Defaults to 500 if not provided.
   * @param {Object} [options={}] Optional parameters to customize the error.
   * @param {string} [options.message] Custom error message. If not provided, a default message based on the status code is used.
   * @param {string} [options.details] Additional details about the error.
   */
  constructor(status = 500, { message, details } = {}) {
    super(message || messageList[status]);
    this.status = status;
    if (details) {
      this.details = details;
    }
  }
}

export default HttpError;
