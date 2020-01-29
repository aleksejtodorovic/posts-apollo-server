const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { SECRET_KEY } = require('../../config');
const { validateRegisterInput, validateLoginInput } = require('../../util/validators');
const User = require('../../models/User');


const generateToken = user => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h' });
};

module.exports = {
    Query: {},
    Mutation: {
        register: async (parent, { registerInput: { username, email, password, confirmPassword } }, context, info) => {
            // validate user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);

            if (!valid) {
                throw new UserInputError('Wrong input fields', { errors });
            }
            // Make sure that user does not exist
            const user = await User.findOne({ username });

            if (user) {
                throw new UserInputError('User already exists', {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }
            // hash password and create token
            password = await bcryptjs.hash(password, 12);

            const savedUser = await new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            }).save();

            const token = generateToken(savedUser);

            return {
                ...savedUser._doc,
                id: savedUser._id,
                token
            }
        },
        login: async (parent, { loginInput: { username, password } }) => {
            const { valid, errors } = validateLoginInput(username, password);

            if (!valid) {
                throw new UserInputError('Credentials not provided', { errors });
            }

            const user = await User.findOne({ username });

            if (!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', { errors });
            }

            const match = await bcryptjs.compare(password, user.password);

            if (!match) {
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials', { errors });
            } else {
                const token = generateToken(user);

                return {
                    ...user._doc,
                    id: user._id,
                    token
                };
            }
        }
    }
}