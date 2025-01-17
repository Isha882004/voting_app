const jwt = require('jsonwebtoken');

const jwtauthmidddle = (req, res, next) => {

    // first check request headers has authorization or not
    const authorization = req.headers.authorization
    //if(!authorization) return res.status(401).json({ error: 'Token Not Found' });
     
    if (!authorization || !authorization.startsWith('Bearer ')) {
        console.err('authoriztion header is issing');
        return res.status(401).json({ message: 'No token provided or incorrect format' });
    }
    // Extract the jwt token from the request heade                     rs
    const token = req.headers.authorization.split(' ')[1];
    console.log('extracted token');
    if(!token) return res.status(401).json({ error: 'Unauthorized token missing' });

    try{
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user information to the request object
        req.user = decoded;
        next();
    }catch(err){
        console.error(err);
        res.status(401).json({ error: 'Invalid token',details: err.message });
    }
};


// Function to generate JWT token
const generatetoken= (userdata) => {
    // Generate a new JWT token using user data
   try{ return jwt.sign(userdata, process.env.JWT_SECRET, {expiresIn: '2h'});
}
catch (err) {
    console.error('Token Generation Error:', err.message);
    throw new Error('Token generation failed');
}};

module.exports = {jwtauthmidddle, generatetoken};