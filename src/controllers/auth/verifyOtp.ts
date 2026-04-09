import { NextFunction, Request, Response } from "express";
import redisService from "../../services/redisService";

export default async function verifyOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { body } = req;
    const { phone, otp } = body;

    if (!phone || !otp) {
        return res.status(400).json({ error: { message: "Phone number and OTP are required." } });
    }

    const redisKey = `${phone}OTP`;
    const storedOtp = await redisService.readRd(redisKey);

    if (!storedOtp || storedOtp !== otp) {
        return res.status(400).json({ error: { message: "Invalid or expired OTP." } });
    }

    // await redisService.delRd(redisKey);

    return res.status(200).json({ 
        status: "success", 
        message: "OTP verified successfully",
        data: {
            phone
        }
    });

  } catch (error) {
    console.log({ error });
    next(error);
  }
}
