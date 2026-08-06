import authRepository from "./auth.repository.js";
import { hashPassword, comparePassword } from "../../core/utils/password.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../core/utils/jwt.js";

import ApiError from "../../core/errors/ApiError.js";
import { HTTP_STATUS } from "../../core/constants/httpStatus.js";
import { ROLES } from "../../core/constants/roles.js";

class AuthService {
  /**
   * Register a new user
   *
   * NOTE — SECURITY TRADEOFF, set intentionally at project owner's request:
   * Public signup now allows self-registration as STUDENT, FACULTY, or
   * ADMIN. There is no invite code, approval step, or verification of
   * any kind — anyone who can reach this endpoint can create an ADMIN
   * account with full control of the system. This was previously locked
   * to STUDENT-only specifically to prevent that. Revisit before this
   * app ever touches real data.
   */
  async register(userData) {
    const { firstName, lastName, email, password, role } = userData;

    const requestedRole =
      role && Object.values(ROLES).includes(role) ? role : ROLES.STUDENT;

    // Check if email already exists
    const existingUser = await authRepository.findUserByEmail(email);

    if (existingUser) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "User already exists with this email."
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user — role now comes from client input, per project owner's
    // explicit choice (see note above).
    const user = await authRepository.createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: requestedRole,
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken();

    // Store refresh token
    await authRepository.createRefreshToken({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
    });

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Create a user with any role — ADMIN only.
   * Used when an Admin wants to provision an account directly.
   * Does not issue tokens: the admin creating the account is not
   * logging in as that user.
   */
  async createUserByAdmin(userData) {
    const { firstName, lastName, email, password, role } = userData;

    const existingUser = await authRepository.findUserByEmail(email);

    if (existingUser) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "User already exists with this email."
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await authRepository.createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
  }

  /**
   * Login user
   */
  async login(email, password) {
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Invalid email or password."
      );
    }

    const passwordMatched = await comparePassword(
      password,
      user.password
    );

    if (!passwordMatched) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Invalid email or password."
      );
    }

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken();

    await authRepository.createRefreshToken({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
    });

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Logout current session
   */
  async logout(refreshToken) {
    await authRepository.revokeRefreshToken(refreshToken);

    return {
      message: "Logged out successfully.",
    };
  }

  /**
   * Logout from all devices
   */
  async logoutAll(userId) {
    await authRepository.revokeAllUserTokens(userId);

    return {
      message: "Logged out from all devices.",
    };
  }

  /**
   * Change the logged-in user's password.
   * Requires the current password to be re-confirmed. On success,
   * revokes every other active session — anyone with an old refresh
   * token (including a device that had the password stolen) is
   * logged out everywhere, matching standard security practice.
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    const isMatch = await comparePassword(currentPassword, user.password);

    if (!isMatch) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Current password is incorrect"
      );
    }

    const hashedPassword = await hashPassword(newPassword);

    await authRepository.updatePassword(userId, hashedPassword);
    await authRepository.revokeAllUserTokens(userId);

    return {
      message: "Password changed successfully. Please log in again.",
    };
  }
}

export default new AuthService();
