import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
  const token = req.cookies.jwt;
  try {
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); //verifying the token
    // decoded ? (req.user = decoded) : (req.user = null);
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Unauthorized: wrong token access : ACCESS DENIED" });
    }
    req.user = decoded;
    //assign req.user a value which is we are getting after decoding the token generally their are some info including the user data which is user id etc and some safety related thing like cross scripting prevention

    next();
  } catch (err) {
    console.log("Error in sendMessage controller", err.message); //if any error occurred during try section it will catch error here!
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

export default authenticateUser;
