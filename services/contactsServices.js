import fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

/**
 * Gets all contacts.
 * @returns {object[]} List of contacts.
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
 * Gets single contact from the contacts list by its identifier.
 * @param {string} contactId Contact identifier.
 * @returns {object | null} Contact object if contact was found or null if not.
 */
async function getContactById(contactId) {
  const contactsList = await listContacts();
  const contact = contactsList.find(el => el.id === contactId);
  return contact || null;
}

/**
 * Removes contact from the contacts list by its identifier.
 * @param {string} contactId Contact identifier.
 * @returns {object | null} The contact object that was removed, or null if the contact was not found.
 */
async function removeContact(contactId) {
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
 * Adds contact to the contacts list.
 * @param {string} data.name Contact's name.
 * @param {string} data.email Contacts e-mail address.
 * @param {string} data.phone Contact's phone number.
 * @returns {object | null} The newly added contact object.
 */
async function addContact({ name, email, phone }) {
  const contacts = await listContacts();

  const contact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(contact);

  if (await overwriteDbContacts(contacts)) {
    return contact;
  }
}

/**
 * Overwrites existing contacts list.
 * @param {object[]} contacts New contacts list to replace the existing one
 * @returns {boolean} Successful status of contacts overwriting operation.
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
  removeContact,
  addContact,
};
