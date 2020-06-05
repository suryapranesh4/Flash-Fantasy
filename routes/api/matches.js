const express = require('express');
const router = express.Router();

//@route     /api/matches
//@desc      TEST route
//@access    PUBLIC

router.get('/', (req,res) => {
    res.send('Match route');
});

module.exports = router;