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
        let team_one_players = await Player.find({ team_halfname : team_one_halfname }).lean();
        team_one_players = team_one_players.map((v)=>{return ({...v,'points':0})});

        //Create MatchPlayers Array to add the players of 2 teams of the match
        let team_two_players = await Player.find({ team_halfname : team_two_halfname }).lean();
        team_two_players = team_two_players.map((v)=>{return ({...v,'points':0})});

        let match_players = team_one_players.concat(team_two_players);

        //Create instance of a new match
        let newMatch = new Match({
            team_one_fullname,
            team_two_fullname,
            team_one_halfname,
            team_two_halfname,
            start_time,
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
        const allMatches = await Match.find({ $and:[ {"start_time":{ $gt: new Date() }} ] });
        console.log("found matches ->",allMatches.length);
        if(allMatches)
            return res.json({ matches : allMatches });
        else
            return res.status(400).send('No matches found!');

    } catch(error){
        console.log("Error while getting all the matches",error.message);
        return res.status(500).send('Server Error');
    }
});

//@route     /api/matches -> Get a match by team names
//@desc      GET route
//@access    PRIVATE
router.get('/', auth, async (req,res) => {
    console.log("Get the match : Received->",req.query);
    const { team_one_halfname,team_two_halfname } = req.query;

    if(!team_one_halfname && !team_two_halfname ){
        return res.status(400).json({ message: "Team names are required" });
    }

    try{
        //Check if the match is available with given team names
        let matchDetails = await Match.findOne({ 
            team_one_halfname, 
            team_two_halfname
        });
        if(!matchDetails){
            console.log("No matches available with given team names!");
            return res.status(400).json({ errors : [{ message : "No match available with given team names!" }]});
        }
        
        return res.json(matchDetails);
    } catch(error){
        console.log("Error while getting match detail",error.message);
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

        let user_team_exists = match_exists.match_teams.map((team)=> { return team.username});
        console.log("already added teams",user_team_exists);
        if(user_team_exists.includes(new_team.username)){
            return res.status(400).json({ message : 'User already added a team to this match!'});
        }


        console.log("try to update with new match_team");
        //Create updated match teams array
        let new_match_teams = [...match_exists.match_teams];
        new_match_teams.push(new_team);
        let updateMatch = await Match.findOneAndUpdate(
            {team_one_halfname,team_two_halfname},
            {$set: 
                {
                    match_teams : new_match_teams
                }
            }, 
            {new: true}
        );

        return res.send('Added new match_team for the given match teams');

    } catch(error){
        console.log("Error while adding a match_team",error.message);
        return res.status(500).send('Server Error');
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

        console.log("try to update with points for all match_teams");
        //Loop into matchTeams to add points 
        let new_match_teams = [...match_exists.match_teams];
        await new_match_teams.map((match_team)=>{
            match_team.players.map((player)=>{
                points_info.map((points_player)=>{
                    if(player.firstname == points_player.firstname && 
                        player.lastname == points_player.lastname){
                            player.points = points_player.points;
                            match_team.points += points_player.points;
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
                    match_players : points_info
                }
            }, 
            {new: true}
        );

        return res.send('Added new match_team for the given match teams');

    } catch(error){
        console.log("Error while adding a match_team",error.message);
        return res.status(500).send('Server Error');
    }
});

module.exports = router;