import { Router } from "express";
const router = Router();
import { login, signup, Logout } from "../controllers/auth.controllers.js";
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", Logout);

export default router;
