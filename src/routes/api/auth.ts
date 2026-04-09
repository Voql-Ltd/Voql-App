import { Router } from "express";
import login from "../../controllers/auth/login";
import register from "../../controllers/auth/register";
import sendOtpGuest from "../../controllers/auth/sendOtp";
import verifyOtp from "../../controllers/auth/verifyOtp";
import { loginSchema, registerSchema, sendOtpSchema, validate, verifyOtpSchema } from "../../middleware/validators/auth";

const router = Router();

router.post("/sign-in", validate(loginSchema), login); 
router.post("/sign-up", validate(registerSchema), register);
router.post("/send-otp-guest", validate(sendOtpSchema), sendOtpGuest);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);

export default router;