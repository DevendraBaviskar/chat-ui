import express from "express";
import authenticateUser from "../middlewares/authenticateUser.js";
import checkUserInDatabase from "../middlewares/checkUserInDatabase.js";
import { getUserForSidebar } from "../controllers/user.controller.js";
const router = express.Router();
router.get("/", authenticateUser, checkUserInDatabase, getUserForSidebar);

export default router;
