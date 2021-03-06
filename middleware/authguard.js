const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization");
    // console.log('within authguard')
    console.log("5=",authHeader)
    if (!authHeader) {
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      throw error;
    }
    const token = authHeader .split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
      } catch (err) {
        err.statusCode = 500;
        throw err;
      }
      if (!decodedToken) {
        const error = new Error("Not authenticated.");
        res.status(401).json({messages:"not authenticated"})
        error.statusCode = 401;
        throw error;
      }
      req.userId = decodedToken.userId;
      next();
};