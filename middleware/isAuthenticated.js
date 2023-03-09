const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
   console.log("isAuthenticated headers", req.headers)
  const token = req.headers.authorization?.split(" ")[1];

  if (!token || token === "null") {
    return res.status(400).json({ message: "Token not found" });
  }
 
  try {
   console.log("LINE 12", token, process.env.SECRET)
    const tokenInfo = jwt.verify(token, process.env.SECRET);
    req.user = tokenInfo;
    console.log("this is authenticated user", req.user)
    next();
  } catch (error) {
   console.log("LINE 17!!!!!!")
    console.log(error.message, "Error.message", error)
    return res.status(401).json(error);
  }
  
};

module.exports = isAuthenticated;