import { Router } from "express";
import * as AuthController from "./auth.controller";
import { isVerifiedUser } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/send-otp", AuthController.sentOtp);
router.post("/verify-otp", AuthController.verifyOtp);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", isVerifiedUser, AuthController.logout);

export default router;
