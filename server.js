//importing all required external modules after installation
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const User=require('./models/user')
const bcrypt = require('bcryptjs')

//middleware
const port = 3000
const app = express()
app.use(express.json())

//connecting Mongodb Atlas
mongoose.connect(process.env.MONGO_URL).then(
    ()=>console.log("DB connected successfully....")
).catch(
    (err)=>console.log(err)
)

//API landing page
app.get('/',async(req,res)=>{
    try{
        res.send("<h1 align=center>Welcome to the backend class week 2 </h1>")
    }
    catch(err){
        console.log(err)
    }
})

//API registration page
app.post('/register',async(req,res)=>{
    const  {username,email,password} = req.body
    try{
        const hashPassword = await bcrypt.hash(password,10)
        const newUser = new User({username,email,password:hashPassword})
        await newUser.save()
        console.log("new user is registered successfully....")
        res.json({message:"user created...."})
    }
    catch(err){
        console.log(err)
    }
})

//login page
app.post('/login',async(req,res)=>{
    const  {email,password} = req.body
    try{
        const user = await User.findOne({email});
        if(!user || !(await bcrypt.compare(password,user.password)))
        {
            return res.status(400).json({message:"Invalid Credentials"});
        }
        res.json({message : "Login successful" , username:user.username});
    }
    catch(err){
        console.log(err)
    }
})

//server running and testing
app.listen(port,(err)=> {
    if(err){
        console.log(err)
    }
    console.log("Server is running in port: ",port)
})