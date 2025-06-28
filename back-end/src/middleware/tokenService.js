const jwt = require('jsonwebtoken');


const generateToken = (user) => {
    const payload = {
        sub: user.ownerId,
        role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);
    
    return token;
}

const getUserFromToken = (token) => {
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return {
            ownerId: decoded.sub,
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
    