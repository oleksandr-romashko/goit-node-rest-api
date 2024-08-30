import Contact from "../db/models/Contact.js";
import HttpError from "../helpers/HttpError.js";

/**
 * Gets all contacts.
 *
 * @returns {object[]} List of contacts.
 * @throws {Error} Throws an error if the operation fails, with details about
 * the failure.
 */
async function listContacts(_, { owner }) {
  let contacts;
  try {
    contacts = await Contact.findAll({
      where: {
        owner,
      },
      order: [["id", "asc"]],
    });
  } catch (error) {
    error.message = `Error: while getting all contacts: ${error.message}`;
    throw error;
  }

  return contacts;
}

/**
 * Retrieves a single contact from the contacts list by its identifier.
 *
 * @param {number} id Contact identifier.
 * @returns {object | null} Contact object if contact was found or null if not.
 * @throws {Error} Throws an error if the operation fails, with details about
 * the failure.
 */
async function getContact(id, { owner }) {
  let contact;
  try {
    contact = await Contact.findOne({
      where: {
        id,
        owner,
      },
    });
  } catch (error) {
    error.message = `Failed to retrieve contact with ID ${id}: ${error.message}`;
    throw error;
  }

  return contact || null;
}

/**
 * Removes a contact from the contacts list by its identifier.
 *
 * @param {number} id The identifier of the contact to be removed.
 * @returns {object | null} Removed contact object if the contact was found and
 * deleted, or `null` if the contact was not found.
 * @throws {HttpError} Throws an `HttpError` if the deletion was not effective
 * or if an error occurs during the operation.
 */
async function removeContact(id, { owner }) {
  const contact = await getContact(id, { owner });
  if (!contact) {
    return null;
  }

  try {
    const affectedRows = await Contact.destroy({
      where: { id, owner },
    });
    if (affectedRows === 0) {
      throw new HttpError(400, {
        message: "Nothing to remove or deletion was not effective",
        details: `number of affected rows is ${affectedRows}, contact not found or already deleted`,
      });
    }
    return contact;
  } catch (error) {
    error.message = `Error: while removing contact: ${error.message}`;
    throw error;
  }
}

/**
 * Adds a new contact to the contacts list.
 *
 * @param {object} data The data for the new contact.
 * @param {string} data.name The name of the contact.
 * @param {string} data.email The email address of the contact.
 * @param {string} data.phone The phone number of the contact.
 * @returns {object | null} The newly added contact object.
 * @throws {Error} Throws an error if the contact creation fails, with details
 * about the failure.
 */
async function addContact(_, data) {
  let createdContact;
  try {
    createdContact = await Contact.create({ ...data });
  } catch (error) {
    error.message = `Error: while adding a new contact: ${error.message}`;
    throw error;
  }
  return createdContact;
}

/**
 * Updates contact data. Partial updates are allowed.
 *
 * @param {number} id Contact identifier.
 * @param {object} data Contact data to update.
 * @param {string} [data.name] Contact's name.
 * @param {string} [data.email] Contact's e-mail address.
 * @param {string} [data.phone] Contact's phone number.
 * @returns {object | null} The updated contact object, or null if the contact
 * does not exist.
 * @throws {HttpError} Throws an error if the update operation fails or is not
 * effective.
 */
async function updateContact(id, { owner, ...restData }) {
  let affectedRows;
  try {
    [affectedRows] = await Contact.update(restData, { where: { id, owner } });
  } catch (error) {
    error.message = `Error: while updating contact: ${error.message}`;
    throw error;
  }

  const updatedContact = await getContact(id, { owner });

  if (!affectedRows && updatedContact) {
    throw new HttpError(400, {
      message: "Nothing to update or update was not effective while updating contact",
      details: `number of affected rows is ${affectedRows}`,
    });
  }

  if (!updatedContact) {
    return null;
  }

  return updatedContact;
}

async function updateContactStatus(id, { owner, ...restData }) {
  const updatedContact = await updateContact(id, restData);
  return updatedContact;
}

export default {
  listContacts,
  getContact,
  removeContact,
  addContact,
  updateContact,
  updateContactStatus,
};
