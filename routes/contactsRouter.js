import express from "express";

import {
  createContactReqBodyValidationMiddleware,
  updateContactReqBodyValidationMiddleware,
} from "../middlewares/requestValidationMiddleware.js";
import {
  getAllContactsServiceMiddleware,
  getOneContactServiceMiddleware,
  removeContactServiceMiddleware,
  createContactServiceMiddleware,
  updateContactServiceMiddleware,
} from "../middlewares/serviceCallMiddleware.js";
import { resultValidationMiddleware } from "../middlewares/resultValidationMiddleware.js";
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
  resultValidationMiddleware,
  contactsControllers.getOneContact
);

contactsRouter.delete(
  "/:id",
  removeContactServiceMiddleware,
  resultValidationMiddleware,
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
  resultValidationMiddleware,
  contactsControllers.updateContact
);

export default contactsRouter;
