import User from "../models/user.model.js";

export const getUserForSidebar = async (req, res) => {
  const loggedInUser = req.userId;
  const filterUser = await User.find({ _id: { $ne: loggedInUser } }).select(
    "-password"
  );
  return res.status(200).json({ allUser: filterUser });
};
