import express from "express";

import authenticate from "../middlewares/authenticateMiddleware.js";
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
import { replyValidationMiddleware } from "../middlewares/replyValidationMiddleware.js";
import contactsControllers from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get(
  "/",
  getAllContactsServiceMiddleware,
  contactsControllers.getAllContacts
);

contactsRouter.get(
  "/:id",
  getOneContactServiceMiddleware,
  replyValidationMiddleware("Contact"),
  contactsControllers.getOneContact
);

contactsRouter.delete(
  "/:id",
  removeContactServiceMiddleware,
  replyValidationMiddleware("Contact"),
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
  replyValidationMiddleware("Contact"),
  contactsControllers.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  updateContactStatusReqBodyValidationMiddleware,
  updateContactStatusServiceMiddleware,
  replyValidationMiddleware("Contact"),
  contactsControllers.updateContactStatus
);

export default contactsRouter;
