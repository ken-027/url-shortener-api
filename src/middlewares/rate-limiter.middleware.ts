import rateLimitPackage from "express-rate-limit";
import { PRODUCTION } from "../config/env";
import getIP from "@/utils/getIP.util";

const keyGenerator = getIP;

const rateLimit = rateLimitPackage({
    windowMs: 60 * 1000, // per minute
    limit: 50,
    standardHeaders: true,
    legacyHeaders: false,
});

export const resourceLimit = rateLimitPackage({
    windowMs: 60 * 1000, // per minute
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
});

export const modifyResourceLimit = rateLimitPackage({
    windowMs: 60 * 1000, // per minute
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
});

export const slidingWindow = rateLimitPackage({
    windowMs: 1000 * 60 * 60 * 24, // 24 hours
    limit: PRODUCTION ? 10 : 2,
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: true,
    keyGenerator,
});


export default rateLimit;
