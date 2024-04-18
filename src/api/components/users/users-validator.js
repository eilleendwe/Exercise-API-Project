const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  createUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
      password: joiPassword
        .string()
        .min(6)
        .max(32)
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfNumeric(1)
        .minOfUppercase(1)
        .required()
        .label('Password'),

      //untuk validasi input password_confirm
      password_confirm: joi
        .string()
        .min(6)
        .max(32)
        .required()
        .label('Confirmed Password'),
    },
  },

  updateUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
    },
  },

  patchUser: {
    body: {
      password: joi.string().min(6).max(32).required().label('Password'),
      new_password: joi
        .string()
        .min(6)
        .max(32)
        .required()
        .label('New Password'),
      new_password_confirm: joi
        .string()
        .min(6)
        .max(32)
        .required()
        .label('New Confirmed Password'),
    },
  },
};
