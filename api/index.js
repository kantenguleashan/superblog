const express = require("express");
const cors = require('cors');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const app = express();

const salt = bcrypt.genSaltSync(10);
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://superblogger:ALCh7gbI5P04fq1m@cluster0.hjtdf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.post('/register', async (req, res)=>{
const {username,password} = req.body;   
try{const userDoc= await User.create({
   username,
   password:bcrypt.hashSync(password,salt), 
}); 
res.json(userDoc);
}catch(e){
res.status(400).json(e);
}
});

app.post('/login', async (req,res) => {
 const {username, password} = req.body;
 const userDoc =await User.findOne({username});
 const passOk = bcrypt.compareSync(password, userDoc.password);
 if( passOk){
   //log in
   
 }else {

res.status(400).json('wrong credentials');

 }

});

app.listen(4000);

//mongodb+srv://superblogger:ALCh7gbI5P04fq1m@cluster0.hjtdf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//ALCh7gbI5P04fq1m 