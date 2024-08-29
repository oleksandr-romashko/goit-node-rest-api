import express from "express";

import {
  createContactReqBodyValidationMiddleware,
  updateContactReqBodyValidationMiddleware,
  updateContactStatusReqBodyValidationMiddleware,
} from "../middlewares/contactsRequestValidationMiddleware.js";
import {
  getAllContactsServiceMiddleware,
  getOneContactServiceMiddleware,
  removeContactServiceMiddleware,
  createContactServiceMiddleware,
  updateContactServiceMiddleware,
  updateContactStatusServiceMiddleware,
} from "../middlewares/contactsServiceCallMiddleware.js";
import { contactsReplyValidationMiddleware } from "../middlewares/contactsReplyValidationMiddleware.js";
import contactsControllers from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get(
  "/",
  getAllContactsServiceMiddleware,
  contactsControllers.getAllContacts
);

contactsRouter.get(
  "/:id",
  getOneContactServiceMiddleware,
  contactsReplyValidationMiddleware,
  contactsControllers.getOneContact
);

contactsRouter.delete(
  "/:id",
  removeContactServiceMiddleware,
  contactsReplyValidationMiddleware,
  contactsControllers.deleteContact
);

contactsRouter.post(
  "/",
  createContactReqBodyValidationMiddleware,
  createContactServiceMiddleware,
  contactsControllers.createContact
);

contactsRouter.put(
  "/:id",
  updateContactReqBodyValidationMiddleware,
  updateContactServiceMiddleware,
  contactsReplyValidationMiddleware,
  contactsControllers.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  updateContactStatusReqBodyValidationMiddleware,
  updateContactStatusServiceMiddleware,
  contactsReplyValidationMiddleware,
  contactsControllers.updateContactStatus
);

export default contactsRouter;
