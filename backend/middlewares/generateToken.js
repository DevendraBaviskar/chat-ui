import jwt from "jsonwebtoken";
process.env.JWT_SECRET_KEY;
const generateTokenAndsetCookies = (userid, res) => {
  const token = jwt.sign({ userid }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //15 days
    httpOnly: true, //Prevents client-side access like using javascript but in this case only have access by http request
    sameSite: "strict", // Cookie only sent for same-site requests like the url we have assign during cors operation.
    secure: process.env.NODE_ENV !== "development", //secure - fot the https which is more secure than the http, we'll move to https during production but for now we are in development that's why the secure : false, during production we will change the NODE_ENV variable from development to production then the secure will be true which is https not the http;
  });
  return token; //returning the token   
};

export default generateTokenAndsetCookies;
