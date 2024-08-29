import { DataTypes } from "sequelize";

import sequelize from "../sequelize.js";
import { emailRegEx, emailMinLength } from "../../constants/authConstants.js";

/**
 * Sequelize model definition for the "contact" table.
 *
 * Use the following code to update the database table:
 *   - `Contact.sync({ force: true });` to drop and recreate the table.
 *   - `Contact.sync({ alter: true });` to update the table structure without dropping it.
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
  },
  {
    hooks: {
      afterCreate: record => {
        delete record.dataValues.updatedAt;
        delete record.dataValues.createdAt;
      },
      afterUpdate: record => {
        delete record.dataValues.updatedAt;
        delete record.dataValues.createdAt;
      },
    },
  }
);

export default Contact;
