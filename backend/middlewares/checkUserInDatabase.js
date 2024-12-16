import User from "../models/user.model.js";

const checkUserInDatabase = async (req, res, next) => {
  try {
    const isUserExist = await User.findById({ _id: req.user?.userid }).select(
      "-password" //good for security related task
    );
    if (!isUserExist) {
      return res.status(400).json({
        error:
          "Error from the checkUserInDatabase ==>  No user found, Please login",
      });
    }
    req.userId = isUserExist._id;
    next();
  } catch (err) {
    console.log("Error in checkUserInDatabase controller", err.message); //if any error occurred during try section it will catch error here!
    res.status(500).json({ error: "Internal server error!" }); //and send error to the client with status code of 500 which is server error code
  }
};

export default checkUserInDatabase;
