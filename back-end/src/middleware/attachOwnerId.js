const attachOwnerId = (req, res, next) => {
  if (req.user && req.user.ownerId) {
    req.ownerId = req.user.ownerId;
  }
  next();
};

module.exports = { attachOwnerId };
