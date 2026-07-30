import dotenv from "dotenv";

dotenv.config();

const REQUIRED_VARS = [
  "DATABASE_URL",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
];

// Fail fast and loudly at boot if critical secrets are missing,
// instead of letting jwt.sign() silently receive `undefined`.
const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(
    `\n[ENV ERROR] Missing required environment variable(s): ${missing.join(
      ", "
    )}\nCheck your .env file against .env.example and restart the server.\n`
  );
  process.exit(1);
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: Number(process.env.PORT) || 5000,

  DATABASE_URL: process.env.DATABASE_URL,

  // Matches the actual keys used in .env (ACCESS_TOKEN_*, not JWT_*)
  JWT_SECRET: process.env.ACCESS_TOKEN_SECRET,
  JWT_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRY || "15m",

  JWT_REFRESH_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRY || "7d",
};
