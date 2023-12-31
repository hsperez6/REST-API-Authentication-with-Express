'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models');

// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async( req, res, next ) => {
  // TODO
  let message;

  const credentials = auth(req);

  if (credentials) {
    const user = await User.findOne( { where: {username: credentials.name} } );

    if (user) {

      const authenticated = bcrypt.compareSync(credentials.pass, user.confirmedPassword);

      if (authenticated) {
        console.log(`Authentication succesful for username: ${user.username}`);

        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.username}`;
      };

    } else {
      message = `User not found for username: ${credentials.name}`;
    };

  } else {
    message = 'Auth header not found';
  };

  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  };

}