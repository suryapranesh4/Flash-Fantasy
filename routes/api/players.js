const express = require('express');
const router = express.Router();
const { check,validationResult } = require('express-validator');
const Player = require('../../models/Player');
const Team = require('../../models/Team');
const auth = require('../../middleware/auth');

//@route     /api/players -> Add player to a team
//@desc      POST route
//@access    PRIVATE
router.post('/', [ auth ,[
    check('firstname','Firstname is requied').not().isEmpty(),
    check('lastname','Lastname is required').not().isEmpty(),
    check('position_fullname','position fullname is requied').not().isEmpty(),
    check('position_halfname','position halfname is required').not().isEmpty(),
] ], async (req,res) => {
    console.log("Adding a Player to a team : Received->",req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { team,firstname,lastname,position_fullname,position_halfname } = req.body;

    try{
        //Check if user is admin
        const user = await User.findById(req.user.id);
        if(!(user.username === "Surya" || user.squadname === "Flash")){
            console.log("Restricted access!!")
            return res.status(400).json({ error : "Action Denied! You are'nt an admin!" });
        }

        //Check if the team exists -> to add this player
        const teamExists = await Team.findOne({ halfname: team }).populate(
            'team',
            ['fullname,halfname']
        );

        if(!teamExists){
            return res.status(400).json({ error: 'Add a relevant team name!'});
        }

        console.log("team->",teamExists);

        //Create instance of a new player
        let newPlayer = new Player({
            firstname,
            lastname,
            position_fullname,
            position_halfname,
            team_fullname:teamExists.fullname,
            team_halfname:teamExists.halfname
        });

        //Create the player
        await newPlayer.save();
        console.log("New Player is added in DB");
        
        return res.send({ message : 'Player added succesfully!' });

    } catch(error){
        console.log("Error while adding a new player",error.message);
        return res.status(500).send('Server Error');
    }
});

//@route     /api/players/all -> Get all the players
//@desc      GET route
//@access    PRIVATE
router.get('/all', auth, async (req,res) => {
    try{
        const allPlayers = await Player.find();
        if(allPlayers)
            return res.json({ players : allPlayers });
        else
            return res.status(400).send('No Players found!');

    } catch(error){
        console.log("Error while getting a all players",error.message);
        return res.status(500).send('Server Error');
    }
});

//@route     /api/players -> Get player / Get players by teamname
//@desc      GET route
//@access    PRIVATE
router.get('/', auth, async (req,res) => {
    console.log("Get the player : Received->",req.query);
    const { firstname,lastname,team } = req.query;

    if(!firstname && !lastname && !team){
        return res.status(400).json({ message: "Player name/Team name required" });
    }

    try{
        if(firstname){
            //Check if player firstname is available
            let firstnameplayer = await Player.findOne({ firstname });
            if(!firstnameplayer){
                console.log("Player by firstname does not exists!");
                return res.status(400).json({ errors : [{ message : "Invalid First Name of player!" }]});
            }
            
            return res.json(firstnameplayer);
        }

        else if(lastname){
            //Check if player lastname is available
            let lastnameplayer = await Player.findOne({ lastname });
            if(!lastnameplayer){
                console.log("Player by lastname does not exists!");
                return res.status(400).json({ errors : [{ message : "Invalid last Name of player!" }]});
            }
            
            return res.json(lastnameplayer);
        }

        else if(team){
            //Check if the teamname is available
            let teamplayers = await Player.findOne({ team_halfname: team });
            if(!teamplayers){
                console.log("No players available with given teamname!");
                return res.status(400).json({ errors : [{ message : "Invalid team name!" }]});
            }
            
            return res.json(teamplayers);
        }

        else
            return res.status(400).send('Teamname/Playername required');

    } catch(error){
        console.log("Error while getting a new team",error.message);
        return res.status(500).send('Server Error');
    }
    
});

//@route     /api/players -> Update Player
//@desc      PATCH route
//@access    PRIVATE
router.patch('/', [ auth, 
    check('firstname','Firstname is requied').not().isEmpty(),
    check('lastname','Lastname is required').not().isEmpty(),
    check('position_fullname','Position Fullname is requied').not().isEmpty(),
    check('position_halfname','Position Halfname is required').not().isEmpty(),
    check('team_fullname','Team Fullname is requied').not().isEmpty(),
    check('team_halfname','Team Halfname is required').not().isEmpty(),
], async (req,res) => {
    console.log("Get the player of : Received->",req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const { 
        firstname,lastname,
        position_fullname,position_halfname,
        team_fullname,team_halfname 
    } = req.body;

    if(!firstname && !lastname && 
        !position_fullname && !position_halfname && 
        !team_fullname && !team_halfname){
        return res.status(400).json({ message: "All fields values are required!" });
    }

    try{
        //Check if firstname is available
        let searchedPlayerFirst = await Player.findOneAndUpdate(
            {firstname}, 
            {$set: 
                {
                    firstname : firstname, 
                    lastname : lastname,
                    position_fullname : position_fullname,
                    position_halfname : position_halfname,
                    team_fullname : team_fullname,
                    team_halfname : team_halfname
                }
            }, 
            {new: true}
        );
        if(searchedPlayerFirst)
        {
            console.log("Updated Player ->",searchedPlayerFirst);
            return res.json({ updatedPlayer : searchedPlayerFirst });
        }

       //Check if lastname is available
       let searchedPlayerSecond = await Player.findOneAndUpdate(
            {lastname}, 
            {$set: 
                {
                    firstname : firstname, 
                    lastname : lastname,
                    position_fullname : position_fullname,
                    position_halfname : position_halfname,
                    team_fullname : team_fullname,
                    team_halfname : team_halfname
                }
            }, 
            {new: true}
        );
        if(searchedPlayerSecond)
        {
            console.log("Updated Player ->",searchedPlayerSecond);
            return res.json({ updatedPlayer : searchedPlayerSecond });
        }


        return res.status(400).send('Send Appropriate values');

    } catch(error){
        console.log("Error while updating a team",error.message);
        return res.status(500).send('Server Error');
    }
});

//@route     /api/players/ -> delete a player
//@desc      DELETE route
//@access    PRIVATE
router.delete('/', auth, async (req,res) => {
    console.log("Delete this player ->",req.body);
    let { firstname,lastname } = req.body;
    try{
        const deletePlayer = await Player.findOneAndDelete({ firstname, lastname });
        if(deletePlayer)
            return res.send('Player is deleted');
        else
            return res.status(400).send('No Player found!');
    } catch(error){
        console.log("Error while deleting the player",error.message);
        return res.status(500).send('Server Error');
    }
});

module.exports = router;