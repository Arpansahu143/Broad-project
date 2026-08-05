import rateLimit from "express-rate-limit";

/**
 * Applied to every /api/v1 route. Generous enough not to interfere
 * with normal use (dashboards firing several requests on page load),
 * but stops naive scripted abuse.
 */
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        statusCode: 429,
        message: "Too many requests. Please try again later.",
    },
});

/**
 * Applied specifically to login/register/change-password — the
 * endpoints most valuable to brute-force. Much stricter, since a
 * genuine user rarely needs more than a handful of attempts in
 * 15 minutes, but a credential-stuffing script needs thousands.
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        statusCode: 429,
        message: "Too many attempts. Please wait 15 minutes and try again.",
    },
});
