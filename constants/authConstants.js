// e-mail constraints
export const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const emailMinLength = 6;

// password constraints
export const passwordMinLength = 8;
export const passwordRegEx = new RegExp(
  `^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{${passwordMinLength},}$`
);
export const passwordRegExDescription = [
  `should have a minimum length of ${passwordMinLength} characters, contain at least one letter (either uppercase or lowercase), at least one digit, and may include special characters like @, $, !, %, *, ?, and &`,
];
