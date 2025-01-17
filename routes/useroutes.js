const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const {jwtauthmidddle, generatetoken} = require('./../jwt');

// POST route to add a person
router.post('/signup', async (req, res) =>{
    try{
        const data = req.body // Assuming the request body contains the user data

        // Check if there is already an admin user
        const adminuser = await User.findOne({ role: 'admin' });
        if (data.role === 'admin' && adminuser) {
            return res.status(400).json({ error: 'Admin user already exists' });
        }

        // Validate Aadhar Card Number must have exactly 12 digit
        if (!/^\d{12}$/.test(data.aadharcardnumber)) {
            return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
        }

        // Check if a user with the same Aadhar Card Number already exists
        const existinguser = await User.findOne({ aadharcardnumber: data.aadharcardnumber });
        if (existinguser) {
            return res.status(400).json({ error: 'user with the same Aadhar Card Number already exists' });
        }

        // Create a new user document using the Mongoose model
        const newuser = new User(data);

        // Save the new user to the database
        const response = await newuser.save();
        console.log('data saved');

        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload));
        const token = generatetoken(payload);

        res.status(200).json({response: response, token: token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

// Login Route
router.post('/login', async(req, res) => {
    try{
        // Extract aadharcardnumber and password from request body
        const {aadharcardnumber, password} = req.body;

        // Check if aadharcardnumber or password is missing
        if (!aadharcardnumber || !password) {
            return res.status(400).json({ error: 'Aadhar Card Number and password are required' });
        }

        // Find the user by aadharcardnumber
        const user = await User.findOne({aadharcardnumber: aadharcardnumber});

        // If user does not exist or password does not match, return error
        if( !user || !(await user.comparepassword(password))){
            return res.status(401).json({error: 'Invalid Aadhar Card Number or Password'});
        }

        // generate Token  
        const payload = {
            id: user.id
        };
        const token = generatetoken(payload);

        // resturn token as response
        res.json({token});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Profile route
router.get('/profile', jwtauthmidddle, async (req, res) => {
    try{
        const userdata = req.user;
        console.log(userdata,'this is user')
        const userid = userdata.id;
        console.log('user id',userid)
        const user = await User.findById(userid);
        console.log(user,'this is user')
        res.status(200).json({user});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/profile/password', jwtauthmidddle, async (req, res) => {
    try {
        const userid = req.user.id; // Extract the id from the token
        const { currentpassword, newpassword } = req.body; // Extract current and new passwords from request body
        console.log(currentpassword,'this is new password',newpassword)
        // Check if currentPassword and newPassword are present in the request body
        if (!currentpassword || !newpassword) {
            return res.status(400).json({ error: 'Both currentPassword and newPassword are required' });
        }

        // Find the user by userid
        const user = await User.findById(userid);

        // If user does not exist or password does not match, return error
        if (!user || !(await user.comparepassword(currentpassword))) {
            return res.status(401).json({ error: 'Invalid current password' });
        }

        // Update the user's password
        user.password = newpassword;
        await user.save();

        console.log('password updated');
        res.status(200).json({ message: 'Password updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;