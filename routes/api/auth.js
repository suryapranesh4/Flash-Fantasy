const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const User = require('../../models/User');

const { check,validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//@route     /api/auth
//@desc      TEST route
//@access    PUBLIC
router.get('/', auth, async(req,res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(error){
        console.log("Failed while fetching user info from DB");
        res.status(500).send('Server Error');
    }
}); 

//@route     POST /api/auth
//@desc      Authenticate user
//@access    PUBLIC
router.post('/', [
    check('username','Username is requied').not().isEmpty(),
    check('password','Password is required').not().isEmpty()
], async (req,res) => {
    console.log("Checking if User exists: Received->",req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { username,password } = req.body;

    try{
        //Check if username is available
        let user = await User.findOne({ username });
        if(!user){
            console.log("Username does not exists!");
            return res.status(400).json({ errors : [{ message : "Incorrect Username!" }]});
        }

        //Check if password is correct
        const isMatch = await bcrypt.compare( password,user.password );
        if(!isMatch){
            console.log("Password is incorrect!");
            return res.status(400).json({ errors : [{ message : "Incorrect Password!" }]});
        }

        //Return jsonwebtoken and log-in User
        const payload = { 
            user: {
                id : user.id
            } 
        };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            ({ expiresIn: 3600 }),
            ( err,token ) => {
                if(err){
                    console.log("JWT Sign error",err);
                    throw err;
                }
                res.json({ token })
            }
        );

    } catch(error){
        console.log("Error while registering User",error.message);
        return res.status(500).send('Server Error');
    }
});

module.exports = router;