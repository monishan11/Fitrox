const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    f_name: {
        type: String,
        required: true
    },
    l_name: {
        type: String,
        required: false,
        default: null
    },
    mobile: {
        type: Number,
        required: false,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    selectedGoal: {
        type: String,
        required: true,
        default: null
    },
    gender: {
        type: String,
        required: true,
        default: null
    },
    age: {
        type: Number,
        required: true,
        default: null
    },
    height: {
        type: Number,
        required: true,
        default: null
    },
    weight: {
        type: Number,
        required: true,
        default: null
    }

});

module.exports = mongoose.model('User', userSchema);



