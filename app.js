import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";
import cors from "cors";

import contactsRouter from "./routes/contactsRouter.js";
import HttpError from "./helpers/HttpError.js";

/**
 * Port on which the Express server will listen.
 */
const PORT = process.env.PORT || 3000;
/**
 * Flag indicating whether debugging is enabled.
 * Prints additional detailed messages on errors.
 */
const IS_DEBUG_ENV = process.env.DEBUG;

/**
 * Creates an instance of an Express application
 */
const app = express();

/**
 * Middleware for logging HTTP requests using morgan.
 */
app.use(morgan("tiny"));
/**
 * Middleware for enabling Cross-Origin Resource Sharing (CORS).
 * Allows requests from different origins to access the resources.
 */
app.use(cors());
/**
 * Middleware for parsing JSON bodies in HTTP requests.
 * Allows the app to process JSON payloads in incoming requests.
 */
app.use(express.json());

/**
 * Route handler for all contact-related routes.
 */
app.use("/api/contacts", contactsRouter);

/**
 * Middleware for handling 404 errors for unknown routes.
 * Sends an HTTP 404 error if the requested route does not exist.
 *
 * @param {Object} req Express request object.
 * @param {Function} next Express next middleware function.
 */
app.use((req, _, next) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  next(HttpError(404, { details: `Route '${fullUrl}' not found` }));
});

/**
 * Global error handling middleware.
 * Sends an HTTP error response based on the caught error.
 * If in debug mode, includes additional details about the error.
 *
 * @param {Object} err The error object.
 * @param {Object} res Express response object.
 */
app.use((err, _, res, __) => {
  const { status = 500, message = "Internal Server Error", details } = err;
  const response = { message };
  if (IS_DEBUG_ENV && details) {
    response.details = details;
  }
  res.status(status).json(response);
});

/**
 * Starts the Express server on the specified port.
 * Logs a message indicating that the server is running.
 */
app.listen(PORT, () => {
  console.log(`Server is running. Use our API on port: ${PORT}`);
});
