const jwt = require('jsonwebtoken');
const { verifyTokenv2 } = require('../services/tokenServiceV2');
const prisma = require('../../infrastructure/database/prisma/client');
const { sendErrorResponse } = require('../../utils/helper/responseHelpers');
const { StatusCodes } = require('http-status-codes');



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
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    
    return token;
}


const getUserFromToken = async(token,type) => {
    
    try {

        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const decoded = await verifyTokenv2(token, type)
        const { tokenId } = decoded;
        
        // check if tokenId exists in the database and is not revoked
        const tokenRecord = await prisma.token.findUnique({
          where: { tokenId },
        });
        if (!tokenRecord || tokenRecord.isRevoked) {

          return sendErrorResponse(res, StatusCodes.UNAUTHORIZED, "Invalid or revoked token", "Token error");
        }
        else {
            
            return {
              id: decoded.sub,
              role: decoded.role,
            };
        }
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
    