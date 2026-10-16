import express from "express";
import { AuthController } from "./auth.controllers";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post("/register", AuthController.createUser);
router.post("/login", AuthController.loginUser);
router.post("/refresh-token", AuthController.refreshToken);
router.post(
  "/change-password",
  auth(),
  validateRequest(AuthValidation.changePasswordSchema),
  AuthController.changePassword,
);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post("/google", AuthController.googleAuth);
router.get("/me", auth(), AuthController.getMe);

export const AuthRoutes = router;
