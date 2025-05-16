
import { NextFunction } from 'express';
import { ValidationError } from 'packages/error-handler';
import redis from 'packages/libs/redis';
import { sendEmail } from './sendMail';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 characters, at least one letter and one number

interface RegistrationData {
    name: string;
    email: string;
    password: string;
    phone_number?: string;
    country?: string;
}

export const validateRegistrationData = (data: RegistrationData, userType: "user"|"seller") => {
const { name, email, password, phone_number, country } = data;
if (!name || !email || !password || (userType === "seller" && (!phone_number || !country))) {
    throw new ValidationError("Missing required fields!");
}
if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format!");
}
if (!passwordRegex.test(password)) {
    throw new ValidationError("Password must be at least 8 characters long and contain at least one letter and one number!");
}
}

export const checkOTPRestrictions = async (email: string, next: NextFunction) => {
    if (await redis.get(`otp_lock:${email}`)) {
        return next(new ValidationError("Account locked due to multiple failed attempts! Try again after 30 minutes"));
    }
    if(await redis.get(`otp_spam_lock:${email}`)){
        return next(new ValidationError("Too many OTP requests! Please wait 1hour before requesting again."))
    }
    if (await redis.get(`otp-cooldown:${email}`)) {
        return next(
            new ValidationError("Please wait 1 minute before requesting a new otp")
        )
    }
}

export const trackOTPRequests = async (email:string, next: NextFunction) => {
    const otpRequestKey = `otp_request_count:${email}`
    const otpRequests = parseInt((await redis.get(otpRequestKey))||'0')
    if (otpRequests >= 2) {
        await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600)
        return next(new ValidationError("Too many OTP requests. Please wait 1 hour before requesting again"))
    }
    await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600)
}

export const sendOTP = async (name:string, email:string, template:string) => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await sendEmail(email, "Verify Your Email:", template, {name, otp});
    await redis.set(`otp:${email}`,otp,"EX", 300);
    await redis.set(`otp:${email}`, "true", "EX", 60);
}
