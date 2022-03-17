const checkAuthor = (req, res, next) => {
  if (!req.session.user.id === req.params.id) {
    return res.sendStatus(403);
  }
  return next();
};

module.exports = checkAuthor;
