import Joi from "joi";

import {
  emailRegEx,
  emailChecks,
  passwordChecks,
} from "../constants/authConstants.js";
import validateSchemaValue from "../decorators/validateSchemaValue.js";

/**
 * An array of authentication-related object fields.
 * Order matters so keep current values as is, as code below refers to array index.
 * To extend and add new fields, add them to the end of the array to refer to them by index.
 *
 * @constant
 */
const fields = ["email", "password"];

/**
 * Function to validate email values against multiple checks.
 */
const validateEmail = validateSchemaValue(emailChecks, fields[0]);

/**
 * Function to validate password values against multiple checks.
 */
const validatePassword = validateSchemaValue(passwordChecks, fields[1]);

/**
 * Joi validation schema for registering a user.
 * This schema validates that the required fields are present and correctly formatted.
 *
 * The schema checks for:
 * - A required and valid email field (`email`) using pattern matching and custom validation.
 * - A required password field (`password`) with specific constraints using custom validation.
 *
 * It provides custom error messages for missing or empty fields,
 * as well as for an invalid email format and password requirements.
 *
 * @type {Joi.ObjectSchema}
 */
export const authRegisterUserSchema = Joi.object({
  [fields[0]]: Joi.string()
    .required()
    .custom(validateEmail)
    .pattern(emailRegEx)
    .messages({
      "any.required": `'${fields[0]}' value is required`,
      "string.empty": `'${fields[0]}' value cannot be empty`,
      "string.pattern.base": `'${fields[0]}' should be valid email`,
    }),
  [fields[1]]: Joi.string()
    .required()
    .custom(validatePassword)
    .messages({
      "any.required": `'${fields[1]}' value is required`,
      "string.empty": `'${fields[1]}' value cannot be empty`,
    }),
});

/**
 * Joi validation schema for logging in a user.
 * This schema validates that the required fields are present and correctly formatted.
 *
 * The schema checks for:
 * - A required and valid email field (`email`) using pattern matching and additional custom validation.
 * - A required password field (`password`) with specific constraints using custom validation.
 *
 * It provides custom error messages for missing or empty fields,
 * as well as for an invalid email format using pattern matching and additional custom validation.
 *
 * @type {Joi.ObjectSchema}
 */
export const authLoginUserSchema = Joi.object({
  [fields[0]]: Joi.string()
    .required()
    .custom(validateEmail)
    .pattern(emailRegEx)
    .messages({
      "any.required": `'${fields[0]}' value is required`,
      "string.empty": `'${fields[0]}' value cannot be empty`,
      "string.pattern.base": `'${fields[0]}' should be valid email`,
    }),
  [fields[1]]: Joi.string()
    .required()
    .custom(validatePassword) // TODO remove if excessive
    .messages({
      "any.required": `'${fields[1]}' value is required`,
      "string.empty": `'${fields[1]}' value cannot be empty`,
    }),
});
