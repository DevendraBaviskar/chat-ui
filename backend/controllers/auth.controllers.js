import generateTokenAndsetCookies from "../middlewares/generateToken.js";
import User from "../models/user.model.js"; //user model
import bcrypt from "bcrypt"; //for crypting the password of user

//!SIGNUP FUNCTION
export const signup = async (req, res) => {
  try {
    const { fullName, username, password, gender, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      //if both password input doesn't match throw error
      return res.status(400).json({ error: "Password don't matched!" });
    }

    const isUserExist = await User.findOne({ username }); //if user exist throw an error
    if (isUserExist) {
      return res.status(400).json({ error: "User already exist" });
    }
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
    const hashRounds = 10; //you can increase the number for for strong bcryption but it takes more time
    const salt = await bcrypt.genSalt(hashRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      //creating a new user
      fullName,
      username,
      password: hashedPassword,
      gender, //we have use enum with the value of male and female
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic, // if gender value is male then add the boyprofilepic url
    });

    if (newUser) {
      generateTokenAndsetCookies(newUser._id, res);
      await newUser.save(); //save the user in database
      return res.status(201).json({
        //return created user data back to the client
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data!" });
    }
  } catch (err) {
    console.log("Error in signup controller", err.message); //if any error occurred during try section it will catch error here!
    res.status(500).json({ error: "Internal server error!" }); //and send error to the client with status code of 500 which is server error code
  }
};

//!LOGIN FUNCTION
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const isUserExist = await User.findOne({ username });
    const comparePassword = await bcrypt.compare(
      password,
      isUserExist?.password || ""
    );
    if (!isUserExist || !comparePassword) {
      return res.status(400).json({ error: "Invalid username or password!" });
    }

    const token = generateTokenAndsetCookies(isUserExist._id, res); //generate token and set it as browser cookie which are not accessible by the client using javascript , but using http request server can access to it.
    console.log("Login token ->", token);
    return res.status(200).json({
      msg: "user login successfully!",
      token: token,
    });
  } catch (err) {
    console.log("Error in login controller", err.message); //if any error occurred during try section it will catch error here!
    res.status(500).json({ error: "Internal server error!" }); //and send error to the client with status code of 500 which is server error code
  }
};

//!LOGOUT FUNCTION
export const Logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ msg: "Logged out successfully!" });
  } catch (err) {
    console.log("Error in logout controller", err.message); //if any error occurred during try section it will catch error here!
    res.status(500).json({ error: "Internal server error!" }); //and send error to the client with status code of 500 which is server error code
  }
};
