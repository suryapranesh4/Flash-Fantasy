const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    team_one_fullname: {
        type: String,
        required: true,
    },
    team_two_fullname: {
        type: String,
        required: true,
    },
    team_one_halfname: {
        type: String,
        required: true
    },
    team_two_halfname: {
        type: String,
        required: true
    },
    start_time: {
        type: Date,
        required: true
    },
    points_added: {
        type: Boolean,
        default: false
    },
    match_players: {
        type: Array,
        required: true
    },
    match_teams: {
        type: Array
    }
});

module.exports = Match = mongoose.model('match',MatchSchema);