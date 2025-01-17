const express= require('express');
const router= express.Router();
const User = require('../models/user');
 const {jwtauthmidddle, generatetoken}= require('../jwt');
const Candidate=require('../models/candidate');

const checkmiddle = async (userid) => {
    try{
         const user = await User.findById(userid);
         if(user.role === 'admin'){
             return true;
         }
    }catch(err){
         return false;
    }
 }
 

  router.post('/', jwtauthmidddle, async (req, res) =>{
    try{
        if(!(await checkmiddle(req.user.id)))
            return res.status(403).json({message: 'user does not have admin role'});

        const data = req.body // Assuming the request body contains the candidate data

        // Create a new User document using the Mongoose model
        const newCandidate = new Candidate(data);

        // Save the new user to the database
        const response = await newCandidate.save();
        console.log('data saved');
        res.status(200).json({response: response});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

  ///////////////
  
  
  router.put('/:candidateid',jwtauthmidddle,async(req,res)=>{
    try{
        if(!(await checkmiddle(req.user.id)))
            return res.status(403).json({message:'user is not admin role no updation'})
        const candidate = await Candidate.find({}, 'name party age _id');

        // Return the list of candidates
        res.status(200).json(candidate);
        const candidateid=req.params.candidateid;
        const updatecandidate=req.body;
        const response =await Candidate.findByIdAndUpdate(candidateid,updatecandidate,{
            new: true,
            runValidators:true,
        })
        if(!response){
            return res.status(404).json({error:'candidate data not update'});
        }
        console.log('updatde',response);
        res.status(200).json(response);
     } catch(err){
        console.log(err);
        res.status(500).json({eror:'internal server error'});
     }
  });
  router.delete('/:candidateid',jwtauthmidddle,async(req,res)=>{
    try{
        if(!checkmiddle(req.user.id))
            return res.status(403).json({message:'user is not admin role no deletion'})
        
        const candidateid=req.params.candidateid;

        const response =await Candidate.findByIdAndDelete(candidateid);
        if(!response){
            return res.status(404).json({error:'candidate data not update'});
        }
        console.log('deleted');
        res.status(200).json(response);
     } catch(err){
        console.log(err);
        res.status(500).json({eror:'message not send'});
     }
  });
  router.get('/vote/count', async (req, res) => {
    try{
        // Find all candidates and sort them by voteCount in descending order
        const candidate = await Candidate.find().sort({votecount: 'desc'});

        // Map the candidates to only return their name and voteCount
        const voteRecord = candidate.map((data)=>{
            return {
                party: data.party,
                count: data.votecount
            }
        });
           console.log('mapped voter record',voteRecord);
        return res.status(200).json(voteRecord);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

  router.get('/vote/:candidateid', jwtauthmidddle, async (req, res)=>{
    // no admin can vote
    // user can only vote once
      
    const candidateid = req.params.candidateid;
    const userid = req.user.id;

    try{
        // Find the Candidate document with the specified candidateid
        const candidate = await Candidate.findById(candidateid);
        console.log(candidate,'this is id');
        if(!candidate){
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const user = await User.findById(userid);
        if(!user){
            return res.status(404).json({ message: 'user not found' });
        }
        if(user.role === 'admin'){
            return res.status(403).json({ message: 'admin is not allowed to give vote'});
        }
        if(user.isvoted){
            return res.status(400).json({ message: 'You have already voted' });
        }

        // Update the Candidate document to record the vote
        candidate.votes.push({user : userid})
        candidate.votecount++;
        await candidate.save();

        // update the user document
        user.isvoted = true
        await user.save();

        return res.status(200).json({ message: 'Vote recorded successfully' });
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal Server Error'});
    }
});

// vote count 

// Get List of all candidates with only name and party fields
router.get('/', async (req, res) => {
    try {
        // Find all candidates and select only the name and party fields, excluding _id
        const candidates = await Candidate.find({}, 'name party age _id votes votecount');

        // Return the list of candidates
        res.status(200).json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
  
  module.exports=router;
 