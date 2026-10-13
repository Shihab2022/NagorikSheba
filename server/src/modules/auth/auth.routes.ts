import express from "express";
import { AuthController } from "./auth.controller";

const router = express.Router();


router.post('/register', AuthController.createUser);
router.post('/login', AuthController.loginUser);


router.get("/me", AuthController.getMe);



export const AuthRouter = router;
