
const attachUserId = (req, res, next) => {
  if (req.user && req.user.id) {
    req.userId = req.user.id;
  }
  
  next();
};

module.exports = {attachUserId };
