let bonus = (req, res, next) => {
    if (req.user.initialUnit !== 0) {
      return res.json({
        isUnit: false,
        success: true
      });
    }
    next();
  };
  
  module.exports = { bonus };
  