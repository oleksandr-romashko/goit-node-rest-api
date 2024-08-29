import serviceWrapper from "../decorators/serviceWrapper.js";
import contactsServices from "../services/contactsServices.js";

export const getAllContactsServiceMiddleware = serviceWrapper(
  contactsServices.listContacts
);

export const getOneContactServiceMiddleware = serviceWrapper(
  contactsServices.getContactById
);

export const removeContactServiceMiddleware = serviceWrapper(
  contactsServices.removeContactById
);

export const createContactServiceMiddleware = serviceWrapper(
  contactsServices.addContact
);

export const updateContactServiceMiddleware = serviceWrapper(
  contactsServices.updateContact
);

export const updateContactStatusServiceMiddleware = serviceWrapper(
  contactsServices.updateContactStatus
);
