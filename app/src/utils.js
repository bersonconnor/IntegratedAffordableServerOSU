/**
 * Returns true if the password meets affordable's security criteria. It
 * returns false if it doesn't. A password must currently meet all of the
 * following criteria:
 * -More than 8 characters
 * -Have atleast one upper case character
 * -Have atleast one lower case character
 * -Have atleast one numeric character
 * -Have atleast one non alphanumeric character
 *
 * @param passwordString a string that represents a password
 * @return a boolean, true if the criteria is met, false otherwise
 */
module.exports.passwordMeetsCriteria = function(passwordString) {
  const longEnough = passwordString.length >= 8;
  const hasLowerCase = /[a-z]/.test(passwordString);
  const hasUpperCase = /[A-Z]/.test(passwordString);
  const hasNumbers = /\d/.test(passwordString);
  const hasNonAlphanumeric = /\W/.test(passwordString);

  return (
    longEnough &&
    hasLowerCase &&
    hasUpperCase &&
    hasNumbers &&
    hasNonAlphanumeric
  );
};

/**
 * Returns true if the email address meets affordable's security criteria. It
 * returns false if it doesn't. A password must currently meet all of the
 * following criteria:
 * - 5 or more characters
 * -Have at least one character before '@' character
 * -Have at least one period
 * -Have at least one '@' symbol
 * -Have at least one character before second period
 * -Have at least one character after second period
 *
 * @param passwordString a string that represents a email
 * @return a boolean, true if the criteria is met, false otherwise
 */
module.exports.emailMeetsCriteria = function(passwordString) {
  const longEnough = passwordString.length >= 5;
  const hasFirstWordChar = /[\w]+@{1}/.test(passwordString);
  const hasAtSymbol = /@/.test(passwordString);
  const hasSecondWordChar = /@{1}[\w]+.{1}/.test(passwordString);
  const hasPeriod = /./.test(passwordString);
  const hasLastWordChar = /.{1}[\w]+/.test(passwordString);
  const hasEntireEmail = /[\w]+@{1}[\w]+.{1}[\w]+/.test(passwordString);

  return (
    longEnough &&
    hasFirstWordChar &&
    hasAtSymbol &&
    hasSecondWordChar &&
    hasPeriod &&
    hasLastWordChar &&
    hasEntireEmail
  );
};
// Returns a list with password feedback
module.exports.getPasswordFeedback = function(passwordString) {
  const feedback = [];

  const longEnough = passwordString.length >= 8;
  const hasLowerCase = /[a-z]/.test(passwordString);
  const hasUpperCase = /[A-Z]/.test(passwordString);
  const hasNumbers = /\d/.test(passwordString);
  const hasNonAlphanumeric = /\W/.test(passwordString);

  if (!longEnough) feedback.push("At least 8 characters are needed");
  if (!hasLowerCase) feedback.push("A lowercase character is needed");
  if (!hasUpperCase) feedback.push("An uppercase character is needed");
  if (!hasNumbers) feedback.push("A number is needed");
  if (!hasNonAlphanumeric) feedback.push("A non alphanumeric is needed");

  return feedback;
};
