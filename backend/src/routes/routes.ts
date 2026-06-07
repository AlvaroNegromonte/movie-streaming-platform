import { Router } from "express";
import { register, googleLogin, deleteMe, checkAuthToken } from "../controllers/authController";
import { userLoginRouter } from "./user_login-routes";

const router = Router();

router.post("/register", register);
router.post("/auth/google", googleLogin);

router.use(userLoginRouter);

router.delete("/users/me", checkAuthToken, deleteMe);

export default router;