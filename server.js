const express = require("express");
const dotenv = require("dotenv");

dotenv.config();


const app = express();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res)=>{
    res.send("<h2>Welcome to LifeGuardian</h2>");
})

app.listen(PORT, ()=>{
    console.log(`Server successfully running on port: ${PORT} in ${process.env.NODE_ENV} mode`);
})