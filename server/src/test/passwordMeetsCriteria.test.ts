const utils = require('../utils');
const assert = require('assert');

describe('passwordMeetsCriteria(string)', function () {
  // Current requirements for a valid password:
  // -More than 8 characters
  // -Have atleast one upper case character
  // -Have atleast one lower case character
  // -Have atleast one numeric character
  // -Have atleast one non alphanumeric character

  it('should return true when all criteria is met', function () {
    assert.equal(
      utils.passwordMeetsCriteria('$pl4shCake!'),
      true
    );
  });

  it('should return true when all criteria is met and non alphanumeric characters are repeated', function () {
    assert.equal(
      utils.passwordMeetsCriteria('$$$$pl4shCake!'),
      true
    );
  });

  it('should return false when passwords are too short', function () {
    assert.equal(
      utils.passwordMeetsCriteria('hello'),
      false
    );
  });

  it('should return false when the password is missing a non alphanumeric character', function () {
    assert.equal(
      utils.passwordMeetsCriteria('Spl4shCake'),
      false
    );
  });

  it('should return false when the password is missing a numeric character', function () {
    assert.equal(
      utils.passwordMeetsCriteria('SplashCake'),
      false
    );
  });

  it('should return false when the password is missing a an upper case character', function () {
    assert.equal(
      utils.passwordMeetsCriteria('$pl4shcake!'),
      false
    );
  });

  it('should return false when the password is made up of all non alphanumeric characters', function () {
    assert.equal(
      utils.passwordMeetsCriteria('$$$$$$$$$$$$$$$$$'),
      false
    );
  });

  it('should return false when the password is an empty string', function () {
    assert.equal(
      utils.passwordMeetsCriteria(''),
      false
    );
  });

});
