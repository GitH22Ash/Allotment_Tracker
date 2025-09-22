const jwt = require('jsonwebtoken');

// This function is a middleware that will run before the route handler for any protected endpoint.
module.exports = function (req, res, next) {
    // 1. Get the token from the 'x-auth-token' header of the request.
    const token = req.header('x-auth-token');

    // 2. Check if a token was not provided.
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // 3. If a token exists, try to verify it.
    try {
        // Decode the token using the same secret key that was used to create it.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. If verification is successful, the 'decoded' variable will contain the payload
        //    (e.g., { supervisor: { id: 'T01', name: 'Dr. Smith' } }).
        //    Attach this payload to the request object so that the next function (the route handler) can access it.
        req.supervisor = decoded.supervisor;

        // 5. Call next() to pass control to the actual route handler (e.g., the logic for '/my-groups').
        next();
    } catch (err) {
        // If jwt.verify fails (e.g., token is expired or invalid), it will throw an error.
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

