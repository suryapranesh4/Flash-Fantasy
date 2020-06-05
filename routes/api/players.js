const express = require('express');
const router = express.Router();

//@route     /api/players
//@desc      TEST route
//@access    PUBLIC

router.get('/', (req,res) => {
    res.send('Players route');
});

module.exports = router;