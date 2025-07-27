
const attachUserId = (req, res, next) => {
  if (req.user && req.user.id) {
    req.userId = req.user.id;
  }
  console.log("Attaching userId to request:", req.userId);
  
  next();
};

module.exports = {attachUserId };
