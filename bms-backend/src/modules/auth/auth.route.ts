import { Router } from "express";
import * as AuthController from "./auth.controller";

const router = Router();

router.post("/send-otp", AuthController.sentOtp);
router.post("/verify-otp", AuthController.verifyOtp);
// router.post("/logout", AuthController.logout);

export default router;
