var crypto = require('crypto');

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const hash = (input) => crypto.createHash('sha256').update(input).digest('hex')

module.exports = {
    random, hash
};