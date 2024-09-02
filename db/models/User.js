import { DataTypes, Sequelize } from "sequelize";

import sequelize from "../sequelize.js";
import {
  emailMinLength,
  emailRegEx,
  passwordMinLength,
} from "../../constants/authConstants.js";

/**
 * Sequelize model definition for the "user" table.
 *
 * Use the following code to update the database table:
 *   - `User.sync({ force: true });` to drop and recreate the table.
 *   - `User.sync({ alter: true });` to update the table structure without dropping it.
 */
const User = sequelize.define(
  "user",
  {
    email: {
      type: DataTypes.STRING(254),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        is: {
          args: emailRegEx,
        },
        len: [emailMinLength, 254],
      },
    },
    password: {
      type: DataTypes.STRING(254),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [passwordMinLength, 254],
      },
    },
    subscription: {
      type: DataTypes.ENUM,
      values: ["starter", "pro", "business"],
      defaultValue: "starter",
    },
    token: {
      type: DataTypes.STRING,
      defaultValue: null,
      validate: {
        notEmpty: true,
      },
    },
    avatarURL: {
      type: DataTypes.STRING,
    },
    verify: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verificationToken: {
      type: DataTypes.STRING,
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

export default User;
