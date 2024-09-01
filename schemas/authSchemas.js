import Joi from "joi";

import {
  emailRegEx,
  emailChecks,
  passwordChecks,
} from "../constants/authConstants.js";
import validateSchemaValue from "../decorators/validateSchemaValue.js";

/**
 * An object of authentication-related fields.
 *
 * @constant {object} fields
 */
const fields = Object.freeze({
  email: "email",
  password: "password",
});

/**
 * Function to validate email values against multiple checks.
 */
const validateEmail = validateSchemaValue(emailChecks, fields.email);

/**
 * Function to validate password values against multiple checks.
 */
const validatePassword = validateSchemaValue(passwordChecks, fields.password);

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
 */
export const authRegisterUserSchema = Joi.object({
  [fields.email]: Joi.string()
    .required()
    .custom(validateEmail)
    .pattern(emailRegEx)
    .messages({
      "any.required": `'${fields.email}' value is required`,
      "string.empty": `'${fields.email}' value cannot be empty`,
      "string.pattern.base": `'${fields.email}' should be valid email`,
    }),
  [fields.password]: Joi.string()
    .required()
    .custom(validatePassword)
    .messages({
      "any.required": `'${fields.password}' value is required`,
      "string.empty": `'${fields.password}' value cannot be empty`,
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
 */
export const authLoginUserSchema = Joi.object({
  [fields.email]: Joi.string()
    .required()
    .custom(validateEmail)
    .pattern(emailRegEx)
    .messages({
      "any.required": `'${fields.email}' value is required`,
      "string.empty": `'${fields.email}' value cannot be empty`,
      "string.pattern.base": `'${fields.email}' should be valid email`,
    }),
  [fields.password]: Joi.string()
    .required()
    .custom(validatePassword)
    .messages({
      "any.required": `'${fields.password}' value is required`,
      "string.empty": `'${fields.password}' value cannot be empty`,
    }),
});
