const express = require('express');
const app = express();

//Connect To Database
const connectDB = require('./config/db');
connectDB();

//Init middleware
app.use(express.json({extended: false}));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/matches', require('./routes/api/matches'));
app.use('/api/players', require('./routes/api/players'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/teams', require('./routes/api/teams'));

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log("Listening on PORT:",PORT);
})