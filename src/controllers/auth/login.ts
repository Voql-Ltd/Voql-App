import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import UserModel from '../../model/User';
import redisService from '../../services/redisService';
import checkUserAccountStatus from '../../utils/checkUserAccountStatus';
import consoleLog from "../../utils/consolelog";

export default async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { body } = req;
    const { phone, otp } = body;

    if (!phone || !otp) {
      return res.status(400).json({ error: { message: "Phone number and OTP are required." } });
    }

    const redisKey = `${phone}OTP`;
    // consoleLog({redisKey})
    const storedOtp = await redisService.readRd(redisKey);

    if (!storedOtp || storedOtp !== otp) {
        return res.status(400).json({ error: { message: "Invalid or expired OTP." } });
    }

    const user = await UserModel.findOne({ formattedText:phone }).lean();
    
    if (!user) {
        return res.status(400).json({ error: { message: "Invalid phone number." } });
    }
    
    const { error: status_error } = checkUserAccountStatus(user.status);
    if (status_error) {
        return res.status(400).json({ error: status_error });
    }

    const token = jwt.sign({_id:user._id}, process.env.APP_SECRET_KEY as string, { expiresIn : '30d' });
    try {
      redisService.delRd(redisKey);
    } catch (error) {
      console.log({ error });
    }

    return res.status(200).json({ 
        status:"success", 
        message: "Logged in successfully",
        data:{
            access_token:token,
            userId:user._id
        }
    });

  } catch (error) {
    console.log({error});
    next(error);
  }
}