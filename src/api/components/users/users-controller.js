const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    const users = await usersService.getUsers();
    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;

    //membuat confirm password
    const password_confirm = request.body.password_confirm;

    //jika password !== dengan password_confirm maka error
    if (password !== password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password dan Confirm Password harus sama!'
      );
    }

    //check email sudah ada apa belum di db
    const emailAda = await usersService.checkEmail(email);

    //kalau email sudah ada, maka cari email lain
    if (emailAda) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already exist!'
      );

      //kalau tidak ada, lanjutkan proses penggantian email
    } else {
      const success = await usersService.createUser(name, email, password);
      if (!success) {
        throw errorResponder(
          errorTypes.UNPROCESSABLE_ENTITY,
          'Failed to create user'
        );
      }
    }

    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    const emailAda = await usersService.checkEmail(email);
    if (emailAda) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already exist'
      );
    } else {
      const success = await usersService.updateUser(id, name, email);
      if (!success) {
        throw errorResponder(
          errorTypes.UNPROCESSABLE_ENTITY,
          'Failed to update user'
        );
      }
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

async function patchUser(request, response, next) {
  try {
    const id = request.params.id;
    const password = request.body.password;
    const new_password = request.body.new_password;
    const new_password_confirm = request.body.new_password_confirm;

    //check password
    const passwordSama = await usersService.checkPassword(id, password);

    //jika password skrg beda dengan yang lama (didb)
    if (!passwordSama) {
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Password salah');
    }

    //password baru dan confirm password baru harus sama
    if (new_password !== new_password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password dan Confirm Password harus sama!'
      );
    }

    //variabel yang menentukan apakah sudah berhasil ganti password apa belum
    const success = await usersService.gantiPassword(id, new_password);
    //jika tidak berhasil maka password gagal diganti
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update password'
      );
    }

    //password berhasil di ganti
    return response.status(200).json({ message: 'Password berhasil diganti!' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  patchUser,
};
