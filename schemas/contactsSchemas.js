import Joi from "joi";

/**
 * An array of contact object fields.
 * Order matters so keep current values as is, as code below refers to array index.
 * For extend and add new fields add them to the end of the array to refer to them by index.
 */
const fields = ["name", "email", "phone"];

/**
 * Joi validation schema for creating a contact.
 * This schema validates that the required fields are present and correctly formatted.
 *
 * The schema checks for:
 * - A required string field (name)
 * - A required and valid email field (email)
 * - A required string field (phone)
 *
 * It provides custom error messages for missing or empty fields,
 * as well as for an invalid email format.
 *
 * Additionally, it checks for unrecognized fields in the request body
 * and lists the valid fields in the error message.
 */
export const contactCreateSchema = Joi.object({
  [fields[0]]: Joi.string()
    .required()
    .messages({
      "any.required": `'${fields[0]}' value is required`,
      "string.empty": `'${fields[0]}' value cannot be empty`,
    }),
  [fields[1]]: Joi.string()
    .email()
    .required()
    .messages({
      "any.required": `'${fields[1]}' value is required`,
      "string.empty": `'${fields[1]}' value cannot be empty`,
      "string.email": `'${fields[1]}' value should be a valid e-mail address`,
    }),
  [fields[2]]: Joi.string()
    .required()
    .messages({
      "any.required": `'${fields[2]}' value is required`,
      "string.empty": `'${fields[2]}' value cannot be empty`,
    }),
}).messages({
  "object.unknown": `an unrecognized field {{#label}} was provided, valid fields are: '${fields.join(
    "', '"
  )}'`,
});

/**
 * Joi validation schema for updating a contact.
 * This schema allows partial updates by validating that at least one of the
 * optional fields (name, email, or phone) is provided.
 *
 * The schema checks for:
 * - An optional string field (name)
 * - An optional and valid email field (email)
 * - An optional string field (phone)
 *
 * It provides custom error messages for empty fields, invalid email format,
 * and missing fields if none of the optional fields are provided.
 *
 * Additionally, it strictly checks for unrecognized fields and lists valid fields
 * in the error message if an unknown field is encountered.
 */
export const contactUpdateSchema = Joi.object({
  [fields[0]]: Joi.string().messages({
    "string.empty": `'${fields[0]}' value cannot be empty`,
  }),
  [fields[1]]: Joi.string()
    .email()
    .messages({
      "string.empty": `'${fields[1]}' value cannot be empty`,
      "string.email": `'${fields[1]}' value should be a valid e-mail address`,
    }),
  [fields[2]]: Joi.string().messages({
    "string.empty": `'${fields[2]}' value cannot be empty`,
  }),
})
  .or(...fields)
  .strict()
  .messages({
    "object.unknown": "an unrecognized field {{#label}} was provided",
    "object.missing": `body must have at least one field, valid fields are: '${fields.join(
      "', '"
    )}'`,
  });
