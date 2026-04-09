import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  nickName: z.string().optional(),
  phone: z.string().min(1, "Phone number is required"),
  imageUrl: z.string().url().optional(),
  otp: z.string().min(1, "OTP is required"),
  formattedText: z.string(),
  countryCode: z.string(),
  countryName: z.string()
});

export const loginSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  otp: z.string().min(1, "OTP is required"),
  mode: z.string().optional()
});

export const sendOtpSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  tryCount:z.number()
}); 
export const verifyOtpSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  otp: z.string().min(1, "OTP is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};

