import express from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
const router = express.Router();

router.post("/register", AuthController.createUser);
router.post("/login", AuthController.loginUser);
router.post("/google", AuthController.googleAuth);
router.get("/me", auth(), AuthController.getMe);

export const AuthRouter = router;
