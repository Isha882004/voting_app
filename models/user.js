const mongoose= require('mongoose');
const bcrypt= require('bcrypt');
const userschema=new mongoose.Schema({
    name: {
            type: String,
            required: true
    },
    age:{
        type: Number,
    },
    mobile:{
        type: String,
    }, 
    email:{
        type: String,
    },
    address:{
        type: String,
        required: true
    },
    aadharcardnumber:
    {
        type :Number,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type:String,
        enum:['voter', 'admin'],
        default: 'voter'
     },
     isvoted:{
        type:Boolean,
        default: false 
     }

});
userschema.pre('save',async function(next){
    const person=this;
    if(!person.isModified('password')) return next();
    try{
        const salt= await bcrypt.genSalt(10); 
        const hashedpass= await bcrypt.hash(person.password,salt);
        person.password= hashedpass;
        next();
    }
    catch(err){
        return next(err);

    }
})

userschema.methods.comparepassword= async function (candidatespass) {
    try{
        const ismatch= await bcrypt.compare(candidatespass,this.password);
        return ismatch; 

    }
    catch(err){
        throw err;
    }
    
}
const user = mongoose.model('user',userschema);
module.exports= user;