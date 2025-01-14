const express= require('express')
const app= express();
const db=require('./db');
// const person=require('./models/person');
require('dotenv').config();

const bodyparser = require('body-parser');
app.use(bodyparser.json());
const PORT =process.env.PORT


const userrout=require('./routes/useroutes');
const candidaterout=require('./routes/candidateroutes');
app.use('/user',userrout);
app.use('/candidate',candidaterout);


 
app.listen(3000,()=>{
    console.log('listening on port 3000');
}) 

