const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    position_fullname: {
        type: String,
        required: true
    },
    position_halfname: {
        type: String,
        required: true
    },
    team_fullname: {
        type: String,
        required: true
    },
    team_halfname: {
        type: String,
        required: true
    }
});

module.exports = Player = mongoose.model('player',PlayerSchema);