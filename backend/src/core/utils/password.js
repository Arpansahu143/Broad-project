import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

/**
 * Hash plain password
 */
export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare passwords
 */
export const comparePassword = async (
  plainPassword,
  hashedPassword
) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};