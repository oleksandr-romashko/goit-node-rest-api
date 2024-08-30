// e-mail constraints and checks
export const emailMinLength = 6;
export const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const emailChecks = [
  {
    regex: /^[^\s@]+@/,
    tip: "should contain characters before the '@' symbol",
  },
  {
    regex: /@[^.\s@]+\./,
    tip: "should contain a domain name after the '@' symbol and a '.'",
  },
  {
    regex: /\.[a-zA-Z]{2,}$/,
    tip: "should end with a valid top-level domain (TLD) after a '.'",
  },
  {
    regex: new RegExp(`^.{${emailMinLength},}$`),
    tip: `should have a minimum length of ${emailMinLength} characters`,
  },
];

/**
 * The expiration time for JWT tokens.
 * This determines how long the token will remain valid.
 *
 * The format is a string that represents the duration.
 *
 * Common values include:
 * - "30m": 30 minutes
 * - "1h": 1 hour
 * - "23h": 23 hours
 * - "1d": 1 day
 * - "7d": 7 days
 * - "2M": 2 months (approximately 60 days)
 */
export const jwtTokenExpirationTime = "23h";
