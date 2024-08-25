import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import validateBody from "../decorators/validateBody.js";
import {
  contactCreateSchema,
  contactUpdateSchema,
} from "../schemas/contactsSchemas.js";
import contactsService from "../services/contactsServices.js";
import validateResult from "../decorators/validateResult.js";
import serviceWrapper, { FUNC_ARGS } from "../decorators/serviceWrapper.js";

// request body validation middleware
const createContactReqValidationMiddleware = validateBody(contactCreateSchema);
const updateContactReqValidationMiddleware = validateBody(contactUpdateSchema);

// service function wrapper middleware
const getAllContactsServiceMiddleware = serviceWrapper(
  contactsService.listContacts
);
const getOneContactServiceMiddleware = serviceWrapper(
  contactsService.getContactById,
  FUNC_ARGS.ID
);
const removeContactServiceMiddleware = serviceWrapper(
  contactsService.removeContactById,
  FUNC_ARGS.ID
);
const createContactServiceMiddleware = serviceWrapper(
  contactsService.addContact,
  FUNC_ARGS.BODY
);
const updateContactServiceMiddleware = serviceWrapper(
  contactsService.updateContact,
  FUNC_ARGS.ID_AND_BODY
);

// no result validation middleware
const noResultValidationMiddleware = validateResult();

const contactsRouter = express.Router();

contactsRouter.get(
  "/",
  getAllContactsServiceMiddleware,
  contactsControllers.getAllContacts
);

contactsRouter.get(
  "/:id",
  getOneContactServiceMiddleware,
  noResultValidationMiddleware,
  contactsControllers.getOneContact
);

contactsRouter.delete(
  "/:id",
  removeContactServiceMiddleware,
  noResultValidationMiddleware,
  contactsControllers.deleteContact
);

contactsRouter.post(
  "/",
  createContactReqValidationMiddleware,
  createContactServiceMiddleware,
  contactsControllers.createContact
);

contactsRouter.put(
  "/:id",
  updateContactReqValidationMiddleware,
  updateContactServiceMiddleware,
  noResultValidationMiddleware,
  contactsControllers.updateContact
);

export default contactsRouter;
