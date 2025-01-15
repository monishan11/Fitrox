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
        required: false,
        default: null
    },
    gender: {
        type: String,
        required: false,
        default: null
    },
    age: {
        type: Number,
        required: false,
        default: null
    },
    height: {
        type: Number,
        required: false,
        default: null
    },
    weight: {
        type: Number,
        required: false,
        default: null
    },
    day: {
        type: Number,
        required: false,
        default: 0
    },
    month: {
        type: Number,
        required: false,
        default: 1
    }

});

module.exports = mongoose.model('User', userSchema);



