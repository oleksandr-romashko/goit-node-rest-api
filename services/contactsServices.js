import fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";

/**
 * The file path to the contacts JSON database.
 */
const contactsPath = path.resolve("db", "contacts.json");

/**
 * Retrieves all contacts from the contacts list.
 *
 * This function reads the contacts data from the specified file path and returns
 * the list of contacts as an array of objects.
 *
 * If the file cannot be read or the data cannot be parsed, it throws an error.
 *
 * @returns {Object[]} An array of contact objects.
 * @throws {Error} Throws an error if the file cannot be read or if the data cannot be parsed.
 */
async function listContacts() {
  let fileContent;
  try {
    fileContent = await fs.readFile(contactsPath, "utf-8");
  } catch (error) {
    throw new Error(`error: while reading contacts from ${contactsPath}`);
  }

  let contacts;
  try {
    contacts = JSON.parse(fileContent);
  } catch (error) {
    throw new Error(`error: while parsing contacts data from ${contactsPath}`);
  }

  return contacts;
}

/**
 * Retrieves a single contact from the contacts list by its identifier.
 *
 * This function searches for a contact in the contacts list using the provided
 * contact ID. If a contact with the specified ID is found, it returns the contact object.
 * If no contact is found, it returns `null`.
 *
 * @param {string} contactId The identifier of the contact to retrieve.
 * @returns {Object | null} The contact object if found, or `null` if the contact was not found.
 */
async function getContactById(contactId) {
  const contactsList = await listContacts();
  const contact = contactsList.find(el => el.id === contactId);
  return contact || null;
}

/**
 * Removes a contact from the contacts list by its identifier.
 *
 * This function searches for a contact by its ID and removes it from the list.
 * If the contact is found and removed, it returns the removed contact object.
 * If the contact is not found, it returns `null`.
 *
 * @param {string} contactId The identifier of the contact to be removed.
 * @returns {Object | null} The contact object that was removed, or `null` if the contact was not found.
 */
async function removeContactById(contactId) {
  const contacts = await listContacts();

  const index = contacts.findIndex(el => el.id === contactId);
  if (index === -1) {
    return null;
  }

  const [removedContact] = contacts.splice(index, 1);

  if (await overwriteDbContacts(contacts)) {
    return removedContact;
  }
}

/**
 * Adds a contact to the contacts list.
 *
 * This function creates a new contact object with the provided name, email, and phone number,
 * and adds it to the contacts list stored in the database.
 *
 * @param {object} data The contact data object.
 * @param {string} data.name The contact's name.
 * @param {string} data.email The contact's email address.
 * @param {string} data.phone The contact's phone number.
 * @returns {Object | null} The newly added contact object, or `null` if contact was not found.
 */
async function addContact(_, { name, email, phone }) {
  const contacts = await listContacts();

  const contact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(contact);

  await overwriteDbContacts(contacts);

  return contact;
}

/**
 * Updates contact data with the given ID. Partial updates are allowed.
 *
 * This function locates a contact by its ID and updates its information
 * with the provided data. If the contact is not found, it returns `null`.
 *
 * @param {string} id The ID of the contact to be updated.
 * @param {Object} data The contact data object containing the fields to be updated.
 * @param {string} [data.name] The updated name of the contact (optional).
 * @param {string} [data.email] The updated email address of the contact (optional).
 * @param {string} [data.phone] The updated phone number of the contact (optional).
 * @returns {Object | null} The updated contact object, or `null` if the contact was not found.
 */
async function updateContact(id, data) {
  const contacts = await listContacts();

  const index = contacts.findIndex(el => el.id === id);
  if (index === -1) {
    return null;
  }
  const updatedContact = {
    ...contacts[index],
    ...data,
  };
  contacts[index] = updatedContact;

  await overwriteDbContacts(contacts);

  return updatedContact;
}

/**
 * Overwrites the existing contacts list with a new list.
 *
 * This function converts the provided contacts array into a JSON string and
 * writes it to the file at the specified path, replacing the existing data.
 *
 * If an error occurs during the conversion to JSON or while writing to the file,
 * the function throws an error.
 *
 * @param {Object[]} contacts The new contacts list to replace the existing one.
 * @returns {boolean} Returns `true` if the contacts were successfully overwritten.
 * @throws {Error} Throws an error if there is an issue with JSON conversion or writing to the file.
 */
async function overwriteDbContacts(contacts) {
  let jsonContacts;
  try {
    jsonContacts = JSON.stringify(contacts, null, 2);
  } catch (error) {
    throw new Error("error: while converting contacts into JSON");
  }

  try {
    await fs.writeFile(contactsPath, jsonContacts, "utf8");
  } catch (error) {
    throw new Error(`error: while writing contacts to ${error.path}`);
  }

  return true;
}

export default {
  listContacts,
  getContactById,
  removeContactById,
  addContact,
  updateContact,
};
