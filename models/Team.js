const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        unique: true
    },
    halfname: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = Team = mongoose.model('team',TeamSchema);