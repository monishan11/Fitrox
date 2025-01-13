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
    }
});

module.exports = mongoose.model('User', userSchema);



