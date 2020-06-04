const express = require('express');
const app = express();

const connectDB = require('./config/db');
connectDB();

// app.use(urlencoded({extended: false}));
// app.use(json());

app.get('/', (req,res) => {
    res.send("Hi Swee");
})

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log("Listening on PORT:",PORT);
})