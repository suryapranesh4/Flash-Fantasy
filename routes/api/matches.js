const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Match = require('../../models/Match');
const Player = require('../../models/Player');
const Team = require('../../models/Team');
const User = require('../../models/User');

const { add_default_points_to_players } = require('../../utils');

//@route     /api/matches -> Create a match
//@desc      POST route
//@access    PRIVATE
router.post('/', [ auth, [
    check('team_one_fullname','team_one_fullname is requied').not().isEmpty(),
    check('team_two_fullname','team_two_fullname is required').not().isEmpty(),
    check('team_one_halfname','team_one_halfname is requied').not().isEmpty(),
    check('team_two_halfname','team_two_halfname is required').not().isEmpty(),
    check('start_time','start_time is required').not().isEmpty(),
] ], async (req,res) => {
    console.log("Adding a Match : Received->",req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { 
        team_one_fullname,
        team_two_fullname,
        team_one_halfname,
        team_two_halfname,
        start_time
        } = req.body;

    //Check whether the two teams are available to create a match
    let team_one_exists = await Team.find({ halfname: team_one_halfname });
    let team_two_exists = await Team.find({ halfname: team_two_halfname });
    console.log(team_one_exists,team_two_exists);

    if(team_one_exists.length == 0 || team_two_exists.length == 0)
        return res.status(400).json({ message : 'Teams must be created first to add a match!'});


    try{
        //Create MatchPlayers Array to add the players of 2 teams of the match
        let team_one_players = await Player.find({ team_halfname : team_one_halfname })
        .sort({ "position_halfname": 1 })
        .lean();
        team_one_players = team_one_players.map((v)=>{return ({...v,'points':0})});

        //Create MatchPlayers Array to add the players of 2 teams of the match
        let team_two_players = await Player.find({ team_halfname : team_two_halfname })
        .sort({ "position_halfname": 1 })
        .lean();
        team_two_players = team_two_players.map((v)=>{return ({...v,'points':0})});

        if(team_one_players.length === 0 || team_two_players.length === 0)
            return res.status(400).send('No players found for the teams given!');

        let match_players = team_one_players.concat(team_two_players);

        //Create instance of a new match
        let newMatch = new Match({
            team_one_fullname,
            team_two_fullname,
            team_one_halfname,
            team_two_halfname,
            start_time: new Date(start_time).toISOString(),
            match_players,
            match_teams : [],
        });

        //Create the match
        await newMatch.save();
        console.log("New Match is added in DB");
        
        return res.send('Match added succesfully!');

    } catch(error){
        console.log("Error while adding a new match",error.message);
        return res.status(500).send('Server Error');
    }   
});

//@route     /api/matches/all -> Get all the matches
//@desc      GET route
//@access    PRIVATE
router.get('/all', auth, async (req,res) => {
    try{
        var d = new Date();    
        d = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
        console.log("d",d);
        // var yyyymmdd = d.toISOString().slice(0,0);
        // console.log("datetime now",yyyymmdd);
        const allMatches = await Match.find({ start_time : { $gt : d } })
        .sort({ "start_time" : 1 });
        console.log("found matches ->",allMatches.length);
        allMatches.forEach((m)=> console.log(m.start_time));

        if(allMatches)
            return res.json({ matches : allMatches });
        else
            return res.status(400).send('No matches found!');

    } catch(error){
        console.log("Error while getting all the matches",error.message);
        return res.status(500).send('Server Error');
    }
});

//@route     /api/matches/currentmatch -> Get a match by team names
//@desc      POST route
//@access    PRIVATE
router.post('/currentmatch', auth, async (req,res) => {
    console.log("Get the match : Received->",req.body);
    const { team_one_halfname,team_two_halfname } = req.body;

    if(!team_one_halfname && !team_two_halfname ){
        return res.status(400).json({ message: "Team names are required" });
    }

    try{
        //Check if the match is available with given team names
        let matchDetails = await Match.findOne({ 
            team_one_halfname, 
            team_two_halfname
        })
        .sort({ "match_players.position_halfname": 1 });
        if(!matchDetails){
            console.log("No matches available with given team names!");
            return res.status(400).json({ error : "No match available with given team names!" });
        }
        const user = await User.findById(req.user.id);
        let currentteam = await matchDetails.match_teams.filter(team => team.username === user.username);
        const currentteamexists = currentteam.length > 0;
        currentteam = currentteam[0];
        console.log("current team ",currentteam);

        return res.json({ currentmatch : matchDetails, currentteam: currentteam ,currentteamexists});
    } catch(error){
        console.log("Error while getting match detail by teamname",error.message);
        return res.status(500).send('Server Error');
    }
    
});

//@route     /api/matches/username -> Get a match by username
//@desc      GET route
//@access    PRIVATE
router.get('/username', auth, async (req,res) => {
    console.log("Get the match of username");

    const user = await User.findById(req.user.id);
    console.log("The user is",user.username);

    try{
        //Check if the match is available with given username
        console.log("find matches of",user.username);
        let allMatches = await Match.find()
        .sort({ "start_time" : 1 });
        let usermatches = [];
        await allMatches.map((match,index)=>{
            match.match_teams.map((team,i)=>{
                if(team.username == user.username)
                    usermatches.push(match);
            })
        });

        return res.json({ usermatches : usermatches });

    } catch(error){
        console.log("Error while getting match detail with username",error.message);
        return res.status(500).send('Server Error');
    }
    
});


//@route     /api/matches/ -> delete a match
//@desc      DELETE route
//@access    PRIVATE
router.delete('/', auth, async (req,res) => {
    console.log("Delete this match ->",req.body);
    let { team_one_halfname,team_two_halfname } = req.body;
    try{
        const deleteMatch = await Match.findOneAndDelete({ team_one_halfname, team_two_halfname });
        if(deleteMatch)
            return res.send('Match is deleted');
        else
            return res.status(400).send('No Match found!');
    } catch(error){
        console.log("Error while deleting the match",error.message);
        return res.status(500).send('Server Error');
    }
});

//@route     /api/matches/addTeam -> Add Match Team
//@desc      PATCH route
//@access    PRIVATE
router.patch('/addTeam', [ auth, 
    check('team_one_halfname','team_one_halfname is requied').not().isEmpty(),
    check('team_two_halfname','team_two_halfname is required').not().isEmpty(),
    check('new_team','new_team is required').not().isEmpty()
], async (req,res) => {
    console.log("Add new team to a match : Received->",req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        team_one_halfname,
        team_two_halfname,
        new_team 
    } = req.body;

    if(
       !team_one_halfname ||
       !team_two_halfname ||
       !new_team){
        return res.status(400).json({ message: "All fields values are required!" });
    }

    try{
        //Check if username of new_team is available
        let user_exists = await User.find({ username: new_team.username });
        if(user_exists.length == 0){
            console.log("Username does not exists");
            return res.status(400).json({ message : 'User is not found! Cannot add the new team!' });
        }

        //Find if match is available to add a new match_team
        let match_exists= await Match.findOne({team_one_halfname,team_two_halfname}).lean();
        console.log("Match to which new match_team are to be added->",match_exists);
        if(!match_exists){
            console.log("Match does not exists");
            return res.status(400).json({ message : 'No match found with given team names!'});
        }

        //Check if user has a match_team in this match
        // If yes, update the team..Else add a team
        let user_team_exists = match_exists.match_teams.map((team)=> { return team.username});

        //if yes,update match_team
        if(user_team_exists.includes(new_team.username)){
            console.log("try to update with new match_team");   
            let existing_match_teams = [...match_exists.match_teams];
            let oldTeamIndex;
            existing_match_teams.forEach((team,index)=>{
                if(team.username === new_team.username)
                    oldTeamIndex = index;
            }) 
            console.log("old team index",oldTeamIndex);
            existing_match_teams.splice(oldTeamIndex, 1, new_team);
            console.log("new array length",existing_match_teams.length);
            let matchTeamUpdated = await Match.findOneAndUpdate(
                {team_one_halfname,team_two_halfname},
                {$set: 
                    {
                        match_teams : existing_match_teams
                    }
                }, 
                {new: true}
            );
            console.log("Updated match_team",matchTeamUpdated);
        }
        //If no,add match_team
        else{
            let match_teams_with_newTeam = [...match_exists.match_teams];
            match_teams_with_newTeam.push(new_team);
            let updateMatchTeams = await Match.findOneAndUpdate(
                {team_one_halfname,team_two_halfname},
                {$set: 
                    {
                        match_teams : match_teams_with_newTeam
                    }
                }, 
                {new: true}
            );
            console.log("Added new match_team",updateMatchTeams);
        }

        return res.json({ matchteamadd : true });

    } catch(error){
        console.log("Error while adding/updating a match_team",error.message);
        return res.status(500).json({ matchteamadd: false });
    }
});


//@route     /api/matches/addPoints -> Add points to players of particular match
//@desc      PATCH route
//@access    PRIVATE
router.patch('/addPoints', [ auth, 
    check('team_one_halfname','team_one_halfname is requied').not().isEmpty(),
    check('team_two_halfname','team_two_halfname is required').not().isEmpty(),
    check('points_info','points_info is required').not().isEmpty()
], async (req,res) => {
    console.log("Add points to a match : Received->",req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        team_one_halfname,
        team_two_halfname,
        points_info
    } = req.body;

    if(
       !team_one_halfname ||
       !team_two_halfname ||
       !points_info){
        return res.status(400).json({ message: "All fields values are required!" });
    }

    try{
        //Find if match is available to add a points to players
        let match_exists= await Match.findOne({team_one_halfname,team_two_halfname}).lean();
        console.log("Match to which points are to be added->",match_exists);
        if(!match_exists){
            console.log("Match does not exists");
            return res.status(400).json({ message : 'No match found with given team names!'});
        }

        //Check if points is already added 
        // if(match_exists.points_added){
        //     return res.status(400).json({ message: 'Points already added for this match!'});
        // }

        console.log("try to update with points for all match_teams");
        //Loop into matchTeams to add points 
        let new_match_teams = [...match_exists.match_teams];
        await new_match_teams.map((match_team)=>{
            match_team.points = 0;
            match_team.players.map((player)=>{
                points_info.map((points_player)=>{
                    if(player.firstname == points_player.firstname && 
                        player.lastname == points_player.lastname){
                            if(player.isCaptain)
                                player.points = points_player.points * 2;
                            else if(player.isViceCaptain)
                                player.points = points_player.points * 1.5;
                            else
                                player.points = points_player.points;
                            match_team.points += player.points;
                        }
                })
            })
        })

        
        //Sort new_match_teams according to match_team points
        for(i = 0; i < new_match_teams.length ; i++){
            for(j = i+1; j < new_match_teams.length; j++){
                if(new_match_teams[i].points < new_match_teams[j].points){
                    let temp = new_match_teams[i];
                    new_match_teams[i] = new_match_teams[j];
                    new_match_teams[j] = temp;
                }
            }
        }
        
        console.log("After points are added and sorted desc->",new_match_teams);
        

        let updateMatch = await Match.findOneAndUpdate(
            {team_one_halfname,team_two_halfname},
            {$set: 
                {
                    match_teams : new_match_teams,
                    match_players : points_info,
                    points_added: true
                }
            }, 
            {new: true}
        );

        return res.send('Added points for the given match players');

    } catch(error){
        console.log("Error while adding points",error.message);
        return res.status(500).send('Server Error');
    }
});

module.exports = router;