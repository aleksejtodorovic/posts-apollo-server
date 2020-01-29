const { model, Schema } = require('mongoose');

const userScema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String
});

module.exports = model('User', userScema)