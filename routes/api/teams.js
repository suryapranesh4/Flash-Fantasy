const express = require('express');
const router = express.Router();

//@route     /api/teams
//@desc      TEST route
//@access    PUBLIC

router.get('/', (req,res) => {
    res.send('Teams route');
});

module.exports = router;