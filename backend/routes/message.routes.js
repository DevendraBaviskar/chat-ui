import { Router } from "express";
import { sendMessage, getMessage } from "../controllers/message.controller.js";
import authenticateUser from "../middlewares/authenticateUser.js";
import checkUserInDatabase from "../middlewares/checkUserInDatabase.js";
const router = Router();

router.post("/send/:id", authenticateUser, checkUserInDatabase, sendMessage);
router.get("/:id", authenticateUser, checkUserInDatabase, getMessage);

export default router;
