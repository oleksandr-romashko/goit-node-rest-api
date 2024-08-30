import { DataTypes } from "sequelize";

import sequelize from "../sequelize.js";
import User from "./User.js";
import { emailRegEx, emailMinLength } from "../../constants/authConstants.js";

/**
 * Sequelize model definition for the "contact" table.
 *
 * The "contact" model represents a contact record associated with a user.
 * The model includes the following fields:
 * - `name`: Contact's name, a non-empty string with a maximum length of 100 characters.
 * - `email`: Contact's email address, a non-empty string that must match the provided email pattern and have a length between `emailMinLength` and 254 characters.
 * - `phone`: Contact's phone number, a non-empty string with a maximum length of 40 characters.
 * - `favorite`: A boolean indicating if the contact is marked as a favorite, defaulting to false.
 * - `owner`: Foreign key linking to the `User` model, representing the owner of the contact. This field is an integer, cannot be null, and cascades on update and delete operations.
 *
 * Use the following code to update the database table:
 *   - `Contact.sync({ force: true });` to drop and recreate the table.
 *   - `Contact.sync({ alter: true });` to update the table structure without dropping it.
 *
 * @typedef {object} Contact
 * @property {string} name - The name of the contact.
 * @property {string} email - The email address of the contact.
 * @property {string} phone - The phone number of the contact.
 * @property {boolean} favorite - Indicates whether the contact is marked as a favorite.
 * @property {number} owner - The ID of the user who owns the contact.
 */
const Contact = sequelize.define(
  "contact",
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100],
      },
    },
    email: {
      type: DataTypes.STRING(254),
      allowNull: false,
      validate: {
        notEmpty: true,
        is: {
          args: emailRegEx,
        },
        len: [emailMinLength, 254],
      },
    },
    phone: {
      /**
       * Length choice rationale:
       * - 15 characters for the maximum E.164 format.
       * - 25-32 characters to accommodate extensions and formatting symbols.
       *   Example: `+1 (415) 555-2671 ext. 1234`
       *   Example: `+1 (415) 555-2671 extension 1234`
       * - 40 characters to allow for more complex phone formats,
       *   including additional formatting, spaces, and long extensions.
       */
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    favorite: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    owner: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    hooks: {
      afterFind: result => {
        if (Array.isArray(result)) {
          result.forEach(record => {
            delete record.dataValues.owner;
            delete record.dataValues.updatedAt;
            delete record.dataValues.createdAt;
          });
        } else if (result) {
          delete result.dataValues.owner;
          delete result.dataValues.updatedAt;
          delete result.dataValues.createdAt;
        }
      },
      afterCreate: record => {
        delete record.dataValues.owner;
        delete record.dataValues.updatedAt;
        delete record.dataValues.createdAt;
      },
      afterUpdate: record => {
        delete record.dataValues.owner;
        delete record.dataValues.updatedAt;
        delete record.dataValues.createdAt;
      },
      afterDestroy: record => {
        delete record.dataValues.owner;
        delete record.dataValues.updatedAt;
        delete record.dataValues.createdAt;
      },
    },
  }
);

export default Contact;
