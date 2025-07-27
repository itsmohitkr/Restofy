const jwt = require('jsonwebtoken');


const generateToken = (user) => {

    const role = user.role;
    const payload = {
      sub: user.id,
      role: user.role,
    };
    if (role === 'Staff') {
        payload.restaurantId = user.restaurantId;
        payload.addedByUserId = user.addedByUserId;
    }
    console.log("Generating token for user:", payload);
    

    const token = jwt.sign(payload, process.env.JWT_SECRET);
    
    return token;
}


const getUserFromToken = (token) => {
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return {
          id: decoded.sub,
          role: decoded.role,
        };
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new Error('Token expired');
        } else if (err.name === 'JsonWebTokenError') {
            throw new Error('Invalid token');
        } else {
            throw new Error('Failed to verify token');
        }
    }
};


module.exports = { generateToken, getUserFromToken };
    