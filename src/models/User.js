const mongoose = require('mongoose');
const Joi = require('joi');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});


const userJoiSchema = Joi.object({
    fullName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});


UserSchema.statics.validateUser = function (userData) {
    return userJoiSchema.validate(userData);
};

module.exports = mongoose.model('User', UserSchema);
