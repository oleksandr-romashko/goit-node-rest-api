import gravatar from "gravatar";
import { defaultGravatarAvatarSize } from "../constants/authConstants.js";

const options = {
  default: "404",
  protocol: "https",
  size: defaultGravatarAvatarSize,
  rating: "g",
};

/**
 * Generates a Gravatar URL for the given email.
 * An example of valid Gravatar emails with actual picture:
 * - test1@example.com
 *
 * @param {string} email The email address for which to generate the Gravatar URL.
 * @returns {Promise<string>} - A promise that resolves to the Gravatar URL.
 */
export async function getGravatarUrl(email) {
  return gravatar.url(email, options);
}
