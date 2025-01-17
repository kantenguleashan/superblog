const express = require("express");
const cors = require('cors');
const User = require('./models/User');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://superblogger:ALCh7gbI5P04fq1m@cluster0.hjtdf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.post('/register', async (req, res)=>{
const {username,password} = req.body;   
try{const userDoc= await User.create({username,password}); 
res.json(userDoc);
}catch(e){
   res.status(400).json(e);
   
}
});

app.listen(4000);

//mongodb+srv://superblogger:ALCh7gbI5P04fq1m@cluster0.hjtdf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//ALCh7gbI5P04fq1m 