const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require('../config');

module.exports = (context) => {
    // context = { ... headers };
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        // Bearer ... (Bearer [space] and then token)
        const token = authHeader.split('Bearer ')[1];

        if (token) {
            try {
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch (ex) {
                throw new AuthenticationError('Invalid/expired token');
            }
        }

        throw new Error('Authentication token must be \'Bearer [token]');
    }


    throw new Error('Authorization header not provided');
};