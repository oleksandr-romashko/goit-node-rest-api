import validateBody from "../decorators/validateBody.js";
import {
  contactCreateSchema,
  contactUpdateSchema,
} from "../schemas/contactsSchemas.js";

export const createContactReqBodyValidationMiddleware =
  validateBody(contactCreateSchema);

export const updateContactReqBodyValidationMiddleware =
  validateBody(contactUpdateSchema);
