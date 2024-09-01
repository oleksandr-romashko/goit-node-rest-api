import fetch from "node-fetch";

/**
 * Checks if a URL returns a valid image.
 *
 * @param {string} url The URL to check.
 * @returns {boolean} True if the URL returns a valid image, false otherwise.
 * @throws {Error} Throws an error if there is an unexpected response status
 * or if there is an issue with fetching the URL.
 */
const validateImageUrl = async url => {
  if (!url) {
    throw new Error(`No URL being provided.`);
  }

  try {
    const response = await fetch(url);

    if (response.ok) {
      return true;
    }

    if (response.status === 404) {
      return false;
    }

    throw new Error(`Unexpected response status: ${response.status}`);
  } catch (error) {
    console.error(`Error checking image URL: ${error.message}`);
    return false;
  }
};

export default validateImageUrl;
