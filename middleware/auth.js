const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req,res,next) => {

    const token = req.header('x-auth-token');

    //Check if token is present in header
    if(!token){
        console.log("No token found in header! User is not authorized!!");
        return res.status(401).json({ message: 'No token, authorization denied'});
    }

    try{
        //Check whether the token is not expired
        const decoded = jwt.verify( token, config.get('jwtSecret') );

        req.user = decoded.user;
        next();

    }catch(err){
        console.log("Token is incorrect/expired! User is not authorized");
        return res.status(401).json({ message: 'Token error' });
    }

}   