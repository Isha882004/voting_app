const express= require('express')
const app= express();
const db=require('./db');
const cors = require('cors');
// const person=require('./models/person');
require('dotenv').config();

const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(cors({
    origin: 'http://127.0.0.1:5501', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']// Allow requests from the frontend port
}));
const PORT =process.env.PORT


const userrout=require('./routes/useroutes');
const candidaterout=require('./routes/candidateroutes');
app.use('/user',userrout);
app.use('/candidate',candidaterout);


 
app.listen(3000,()=>{
    console.log('listening on port 3000');
}) 

