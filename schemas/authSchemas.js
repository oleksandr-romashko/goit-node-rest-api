import Joi from "joi";

import {
  emailRegEx,
  emailMinLength,
  passwordMinLength,
  passwordRegEx,
  passwordRegExDescription,
} from "../constants/authConstants.js";

/**
 * An array of authentication-related object fields.
 * Order matters so keep current values as is, as code below refers to array index.
 * For extend and add new fields add them to the end of the array to refer to them by index.
 */
const fields = ["email", "password"];

/**
 * Joi validation schema for registering a user.
 * This schema validates that the required fields are present and correctly formatted.
 *
 * The schema checks for:
 * - A required and valid email field (email)
 * - A required password field with specific constraints (password)
 *
 * It provides custom error messages for missing or empty fields,
 * as well as for an invalid email format and password requirements.
 */
export const authRegisterUserSchema = Joi.object({
  [fields[0]]: Joi.string()
    .required()
    .pattern(emailRegEx)
    .min(emailMinLength)
    .messages({
      "any.required": `'${fields[0]}' value is required`,
      "string.empty": `'${fields[0]}' value cannot be empty`,
      "string.pattern.base": `'${fields[0]}' value should be a valid e-mail address`,
      "string.min": `'${fields[0]}' value should be at least ${emailMinLength} characters long`,
    }),
  [fields[1]]: Joi.string()
    .required()
    // TODO separate different password pattern constraints into separate constrains:
    // * error messages will be separate for each regex but overall should fullfil main common password pattern
    // * for example:
    // * const hasLetter = /(?=.*[A-Za-z])/;
    // * const hasDigit = /(?=.*\d)/;
    // * const validChars = /^[A-Za-z\d@$!%*?&]*$/;
    .pattern(passwordRegEx)
    .messages({
      "any.required": `'${fields[1]}' value is required`,
      "string.empty": `'${fields[1]}' value cannot be empty`,
      "string.pattern.base": `'${fields[1]}' value ${passwordRegExDescription}`,
    }),
});

/**
 * Joi validation schema for logging in a user.
 * This schema validates that the required fields are present and correctly formatted.
 *
 * The schema checks for:
 * - A required and valid email field (email)
 * - A required password field (password)
 *
 * It provides custom error messages for missing or empty fields,
 * as well as for an invalid email format.
 */
export const authLoginUserSchema = Joi.object({
  [fields[0]]: Joi.string()
    .required()
    .pattern(emailRegEx)
    .min(emailMinLength)
    .messages({
      "any.required": `'${fields[0]}' value is required`,
      "string.empty": `'${fields[0]}' value cannot be empty`,
      "string.pattern.base": `'${fields[0]}' value should be a valid e-mail address`,
      "string.min": `'${fields[0]}' value should be at least ${emailMinLength} characters long`,
    }),
  [fields[1]]: Joi.string()
    .required()
    .messages({
      "any.required": `'${fields[1]}' value is required`,
      "string.empty": `'${fields[1]}' value cannot be empty`,
    }),
});
