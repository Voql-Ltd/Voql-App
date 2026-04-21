import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

import redisService from '../../services/redisService';
import UserModel from '../../model/User';

export default async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { body } = req;
    
    if (!body.otp) {
      return res.status(400).json({ 
        error: { message: "OTP is required for registration" } 
      });
    }

    const redisKey = `${body.formattedText}OTP`;
    const storedOtp: string | null = await redisService.readRd(redisKey);

    if (!storedOtp || storedOtp !== body.otp) {
      return res.status(400).json({ 
        error: { message: "Invalid or expired OTP" } 
      });
    }
    
    const ifUserExists = await UserModel.findOne({
      phone: body.phone
    });

    if (ifUserExists) {
      return res.status(400).json({
        error: { message: "Phone Already Exists" }
      });
    }
    const countUsers=await UserModel.find({}).countDocuments()
    const user = new UserModel({...req.body,index:countUsers});
    await user.save();

    const token = jwt.sign(
      { _id: user._id }, 
      process.env.APP_SECRET_KEY as string, 
      { expiresIn: '30d' }
    );
    try {
      redisService.delRd(redisKey);
    } catch (error) {
      console.log({ error });
    }
    return res
      .status(200)
      .json({ 
        status: "success", 
        message: "Account created", 
        data: { access_token: token, userId: user._id } 
      });
  } catch (error) {
    console.log({ error });
    next(error);
  }
}