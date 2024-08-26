import serviceWrapper, { FUNC_ARGS } from "../decorators/serviceWrapper.js";
import contactsServices from "../services/contactsServices.js";

export const getAllContactsServiceMiddleware = serviceWrapper(
  contactsServices.listContacts
);

export const getOneContactServiceMiddleware = serviceWrapper(
  contactsServices.getContactById,
  FUNC_ARGS.ID
);

export const removeContactServiceMiddleware = serviceWrapper(
  contactsServices.removeContactById,
  FUNC_ARGS.ID
);

export const createContactServiceMiddleware = serviceWrapper(
  contactsServices.addContact,
  FUNC_ARGS.BODY
);

export const updateContactServiceMiddleware = serviceWrapper(
  contactsServices.updateContact,
  FUNC_ARGS.ID_AND_BODY
);
