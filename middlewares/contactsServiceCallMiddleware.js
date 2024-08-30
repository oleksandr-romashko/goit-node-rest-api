import serviceWrapper from "../decorators/serviceWrapper.js";
import contactsServices from "../services/contactsServices.js";

export const getAllContactsServiceMiddleware = serviceWrapper(
  contactsServices.listContacts
);

export const getOneContactServiceMiddleware = serviceWrapper(
  contactsServices.getContact
);

export const removeContactServiceMiddleware = serviceWrapper(
  contactsServices.removeContact
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
