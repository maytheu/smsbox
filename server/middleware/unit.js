let unit = (req, res, next) => {
  if (req.user.units < 1) {
    return res.json({
      isUnit: false,
      success: true
    });
  }
  next();
};

module.exports = { unit };
