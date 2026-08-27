const jwt = require('jsonwebtoken')

function validateAuth(req, res ,next) {
  try{
    const token = req.cookies?.AuthToken;

      if (!token) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {id: decoded.id};

  }catch(error){
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }
    console.log(error);
    return res.status(500).json({
      msg : "something went wrong..."
    });
  }
  next();
}

module.exports = validateAuth;