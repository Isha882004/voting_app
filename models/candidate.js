const mongoose= require('mongoose');
//const bcrypt= require('bcrypt');
const candidateschema=new mongoose.Schema({
    name: {
            type: String,
            required: true
    },
    party:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    votes:[
        {
        user:{
           type: mongoose.Schema.Types.ObjectId,
           ref: 'user',
           required: true
        },
        votedAt:{
        type: Date,
        default: Date.now()
        }

        }],
    votecount:
    {type: Number,
        default:0
    }
    

});
const candidate= mongoose.model('candidate',candidateschema);
module.exports= candidate;