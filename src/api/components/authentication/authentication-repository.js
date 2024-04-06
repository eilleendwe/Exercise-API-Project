const { User } = require('../../../models');

/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

async function checkEmail(email) {
  const userEmail = await getUserByEmail(email);
  if (userEmail !== null) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  getUserByEmail,
  checkEmail,
};
