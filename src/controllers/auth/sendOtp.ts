import { NextFunction, Request, Response } from "express";
import redisService from "../../services/redisService";
import generateRandomString from "../../utils/generateRandomString";
import consoleLog from "../../utils/consolelog";
import UserModel from "../../model/User";

export default async function sendOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { body } = req;
    const { phone, mode, tryCount } = body;

    if (!phone) {
        return res.status(400).json({ error: { message: "Phone number is required." } });
    }
    consoleLog({phone, mode, tryCount}) 
    if(mode==='signin'){
        const user = await UserModel.findOne({ formattedText:phone }).lean();
        if (!user) {
            return res.status(400).json({ error: { message: "User with this phone number not found." } });
        }
    }

    const otp = generateRandomString(6, true);
    

    const redisKey = `${phone}OTP`;
    consoleLog({redisKey})
    
    
    if(tryCount){
        await redisService.modifyRd(redisKey, otp, 3600);
    }
    else{
        await redisService.setRd(redisKey, otp, 3600);
    }

    consoleLog(`OTP for ${phone}: ${otp}`);

    return res.status(200).json({ 
        status: "success", 
        message: "OTP sent successfully",
        data: {
            phone
        }
    });

  } catch (error) {
    console.log({ error });
    next(error);
  }
}
