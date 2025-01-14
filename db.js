const mongoose= require('mongoose');
require('dotenv').config();
// const mongourl = 'mongodb://localhost:27017/hotel'
// mongoose.connect(mongourl


// mongoose.connect('mongodb://localhost:27017/voting')
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Connection error', err));
mongoose.connect('mongodb://127.0.0.1:27017/voting_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
const db=mongoose.connection;
db.on('connected',()=>{
    console.log('mongoose connected');
});
db.on('error',(err)=>{
    console.error('mongoose connection error',err);
});
db.on('disconnected',()=>{
    console.log('mongoose disconnected');
});

module.exports=   db;
