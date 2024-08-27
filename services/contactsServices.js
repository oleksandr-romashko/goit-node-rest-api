import Contact from "../db/models/Contact.js";
import HttpError from "../helpers/HttpError.js";

/**
 * Gets all contacts.
 *
 * @returns {object[]} List of contacts.
 * @throws {Error} Throws an error if the operation fails, with details about
 * the failure.
 */
async function listContacts() {
  let contacts;
  try {
    contacts = await Contact.findAll({
      attributes: { exclude: ["updatedAt", "createdAt"] },
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
async function getContactById(id) {
  let contact;
  try {
    contact = await Contact.findOne({
      attributes: { exclude: ["updatedAt", "createdAt"] },
      where: {
        id,
      },
    });
  } catch (error) {
    error.message = `Error: while getting single contact: ${error.message}`;
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
async function removeContactById(id) {
  const contact = await getContactById(id);
  if (!contact) {
    return null;
  }

  try {
    const affectedRows = await Contact.destroy({ where: { id } });
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
async function addContact(_, { name, email, phone }) {
  let createdContact;
  try {
    createdContact = await Contact.create({ name, email, phone });
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
async function updateContact(id, data) {
  let affectedRows;
  try {
    [affectedRows] = await Contact.update(data, { where: { id } });
  } catch (error) {
    error.message = `Error: while updating contact: ${error.message}`;
    throw error;
  }

  const updatedContact = await getContactById(id);

  if (!affectedRows && updatedContact) {
    throw new HttpError(400, {
      message: "Nothing to update or update was not effective",
      details: `number of affected rows is ${affectedRows}`,
    });
  }

  if (!updatedContact) {
    return null;
  }

  return updatedContact;
}

async function updateContactStatus(id, data) {
  const updatedContact = await updateContact(id, data);
  return updatedContact;
}

export default {
  listContacts,
  getContactById,
  removeContactById,
  addContact,
  updateContact,
  updateContactStatus,
};
