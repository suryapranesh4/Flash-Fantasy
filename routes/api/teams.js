const express = require('express');
const router = express.Router();
const { check,validationResult } = require('express-validator');
const Team = require('../../models/Team');
const auth = require('../../middleware/auth');

//@route     /api/teams -> Create a team
//@desc      POST route
//@access    PRIVATE
router.post('/', [ auth, [
    check('fullname','FullName is requied').not().isEmpty(),
    check('halfname','Halfname is required').not().isEmpty(),
] ], async (req,res) => {
    console.log("Adding a Team : Received->",req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname,halfname } = req.body;

    try{
        //Check if fullname is available
        let fullteamname = await Team.findOne({ fullname });
        if(fullteamname){
            console.log("Team exists!");
            return res.status(400).json({ errors : [{ message : "Team already exists!" }]});
        }
        else{
            console.log("It's a new team fullname");
        }

        //Check if halfname is available
        let halfteamname = await User.findOne({ halfname });
        if(halfteamname){
            console.log("Team halfname exists!");
            return res.status(400).json({ error : [{ message : "Team Halfname exists!" }]});
        }
        else{
            console.log("It's a new team halfname");
        }

        //Create instance of a new team
        let newTeam = new Team({
            fullname,
            halfname,
        });

        //Create the team
        await newTeam.save();
        console.log("New Team is added in DB");
        
        return res.send('Team added succesfully!');

    } catch(error){
        console.log("Error while adding a new team",error.message);
        return res.status(500).send('Server Error');
    }   
});

//@route     /api/teams/all -> Get all the teams
//@desc      GET route
//@access    PRIVATE
router.get('/all', auth, async (req,res) => {
    try{
        const allTeams = await Team.find();
        if(allTeams)
            return res.json({ teams : allTeams });
        else
            return res.status(400).send('No teams found!');

    } catch(error){
        console.log("Error while getting all the teams",error.message);
        return res.status(500).send('Server Error');
    }
});

//@route     /api/teams -> Get team
//@desc      GET route
//@access    PRIVATE
router.get('/', auth, async (req,res) => {
    console.log("Get the team of : Received->",req.query);
    const { fullname,halfname } = req.query;

    if(!fullname && !halfname){
        return res.status(400).json({ message: "Teamname required" });
    }

    try{
        if(fullname){
            //Check if fullname is available
            let fullteamname = await Team.findOne({ fullname });
            if(!fullteamname){
                console.log("Teamname does not exists!");
                return res.status(400).json({ errors : [{ message : "Invalid Teamname!" }]});
            }
            
            return res.json(fullteamname);
        }

        else if(halfname){
            //Check if halfname is available
            let halfteamname = await User.findOne({ halfname });
            if(!halfteamname){
                console.log("Teamname does not exists!");
                return res.status(400).json({ error : [{ message : "Invalid Teamname!" }]});
            }

            return res.json(halfteamname);
        }

        else
            return res.status(400).send('Teamname required');

    } catch(error){
        console.log("Error while getting a new team",error.message);
        return res.status(500).send('Server Error');
    }
});

//@route     /api/teams -> Update team
//@desc      PATCH route
//@access    PRIVATE
router.patch('/', [ auth, 
    check('fullname','FullName is requied').not().isEmpty(),
    check('halfname','Halfname is required').not().isEmpty(),
], async (req,res) => {
    console.log("Get the team of : Received->",req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const { fullname,halfname } = req.body;

    if(!fullname && !halfname){
        return res.status(400).json({ message: "All fields values are required!" });
    }

    try{
        //Check if fullname is available
        let fullteamname = await Team.findOneAndUpdate(
            {fullname}, 
            {$set: {fullname: fullname , halfname: halfname}}, 
            {new: true}
        );

        if(fullteamname)
        {
            console.log("Updated Team ->",fullteamname);
            return res.json({ fullteamname });
        }

        //Check if halfname is available
        let halfteamname = await Team.findOneAndUpdate(
            {halfname}, 
            {$set: {fullname: fullname , halfname: halfname}}, 
            {new: true}
        );
        
        if(halfteamname){
            console.log("Updated Team ->",halfteamname);
            return res.json({ halfteamname });
        }

        return res.status(400).send('Send Appropriate values');

    } catch(error){
        console.log("Error while updating a team",error.message);
        return res.status(500).send('Server Error');
    }
});

//@route     /api/teams/ -> delete a team
//@desc      DELETE route
//@access    PRIVATE
router.delete('/', auth, async (req,res) => {
    console.log("Delete this team ->",req.body);
    let { team } = req.body;
    try{
        const deleteteam = await Team.findOneAndDelete({ halfname : team });
        if(deleteteam)
            return res.send('Team is deleted');
        else
            return res.status(400).send('No team found!');
    } catch(error){
        console.log("Error while deleting the team",error.message);
        return res.status(500).send('Server Error');
    }
});

module.exports = router;