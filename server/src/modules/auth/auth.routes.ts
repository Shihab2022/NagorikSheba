import express from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
const router = express.Router();

<<<<<<< HEAD

router.post('/register', AuthController.createUser);
router.post('/login', AuthController.loginUser);


router.get("/me", AuthController.getMe);
=======
router.post("/register", AuthController.createUser);
router.post("/login", AuthController.loginUser);
router.post("/google", AuthController.googleAuth);
router.get("/me", auth(), AuthController.getMe);
>>>>>>> 0b4e698bbfd63faf60bbc38a9a028642f805bbf9



export const AuthRouter = router;
