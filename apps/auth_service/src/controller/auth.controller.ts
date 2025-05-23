import { Request, Response, NextFunction } from "express";
import { checkOTPRestrictions, sendOTP, trackOTPRequests, validateRegistrationData } from "../utils/auth.helper";
import prisma from "packages/libs/prisma";
import { ValidationError } from "packages/error-handler";

export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
try {
        validateRegistrationData(req.body, "user");
        const { name, email} = req.body;
        const existingUser = await prisma.users.findUnique({
            where: email });
        if (existingUser) {
            return next(new ValidationError("User already exists with this email!") );
        };
        await checkOTPRestrictions(email, next);
        await trackOTPRequests(email, next);
        await sendOTP(email, name, "user-activation-mail");
        res.status(200).json({
            message: "OTP sent to email. Please verify your account.",
        })
} catch (error) {
    return next(error)
}
}
