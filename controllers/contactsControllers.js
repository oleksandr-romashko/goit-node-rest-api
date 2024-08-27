/**
 * Controller to handle the request to get all contacts.
 * It retrieves all contacts in an array from the request variable
 * saved by the previous middleware
 * and sends them in the response.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const getAllContacts = (req, res) => {
  const allContacts = req.serviceMiddlewareArtifact;
  res.json(allContacts);
};

/**
 * Controller to handle the request to get a single contact by ID.
 * It retrieves contact from the request variable
 * saved by the previous middleware
 * and sends it in the response.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const getOneContact = (req, res) => {
  const singleContact = req.serviceMiddlewareArtifact;
  res.json(singleContact);
};

/**
 * Controller to handle the request to delete a contact by ID.
 * It retrieves deleted contact from the request variable
 * saved by the previous middleware
 * and sends it in the response.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const deleteContact = (req, res) => {
  const deletedContact = req.serviceMiddlewareArtifact;
  res.json(deletedContact);
};

/**
 * Controller to handle the request to create a new contact.
 * It retrieves created contact from the request variable
 * saved by the previous middleware
 * and sends it in the response.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const createContact = (req, res) => {
  const createdContact = req.serviceMiddlewareArtifact;
  res.status(201).json(createdContact);
};

/**
 * Controller to handle the request to update an existing contact.
 * It retrieves updated contact from the request variable
 * saved by the previous middleware
 * and sends it in the response.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const updateContact = (req, res) => {
  const updatedContact = req.serviceMiddlewareArtifact;
  res.json(updatedContact);
};

export default {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
};
