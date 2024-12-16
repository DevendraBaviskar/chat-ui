import express from "express"; //for routing and middlewares
import dotenv from "dotenv"; //for storing the sensitive info
import cookieParser from "cookie-parser"; //for browser cookies

import authRoutes from "./routes/auth.routes.js"; //auth routes
import messageRoutes from "./routes/message.routes.js"; //message routes
import userRoutes from "./routes/user.routes.js"; //user routes

import connectToMongoDB from "./db/connectToMongoDB.js"; //database function path
import authenticateUser from "./middlewares/authenticateUser.js"; // middleware for checking the token from the incoming request
import checkUserInDatabase from "./middlewares/checkUserInDatabase.js"; // middleware for checking the user in database using the data from the token.
const PORT = process.env.PORT || 5000; //port
const app = express(); //assign app a express function

dotenv.config();
app.use(express.json()); //to parse the incoming request with json payload (from req.body)
app.use(cookieParser());
app.use("/api/auth", authRoutes); //auth routes
app.use("/api/message", messageRoutes); //message routes
app.use("/api/users", userRoutes); //user routes

app.get("/payment", authenticateUser, checkUserInDatabase, (req, res) => {
  console.log("payment successfully!");
  const { username, gender, _id } = req.body;

  return res.status(200).json({ name: username, sex: gender, id: _id });
});
app.listen(PORT, () => {
  //server listening on port 5000;
  connectToMongoDB();
  console.log(`server is running on port: ${PORT}`);
});
