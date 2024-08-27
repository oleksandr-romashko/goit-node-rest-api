import validateBody from "../decorators/validateBody.js";
import {
  contactCreateSchema,
  contactUpdateSchema,
  contactUpdateContactStatusSchema,
} from "../schemas/contactsSchemas.js";

export const createContactReqBodyValidationMiddleware =
  validateBody(contactCreateSchema);

export const updateContactReqBodyValidationMiddleware =
  validateBody(contactUpdateSchema);

export const updateContactStatusReqBodyValidationMiddleware = validateBody(
  contactUpdateContactStatusSchema
);
