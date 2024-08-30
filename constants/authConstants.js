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
