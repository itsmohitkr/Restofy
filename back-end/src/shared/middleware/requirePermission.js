// back-end/src/middleware/requirePermission.js
const { ROLE_PERMISSIONS } = require("../../utils/constants/permissions");
const { sendErrorResponse } = require("../../utils/helper/responseHelpers");
const {StatusCodes} = require("http-status-codes");

function requirePermission(permission) {
  return (req, res, next) => {
    
    const permissions = ROLE_PERMISSIONS[req.user.role] || [];
    if (!permissions.includes(permission)) {
       
        return sendErrorResponse(
          res,
          StatusCodes.FORBIDDEN,
          `Forbidden: insufficient permissions with role, ${req.user.role}`,
          "Permission Denied"
        );
    }
    next();
  };
}

module.exports = requirePermission;
