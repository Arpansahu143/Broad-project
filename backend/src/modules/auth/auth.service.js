import authRepository from "./auth.repository.js";
import { hashPassword, comparePassword } from "../../core/utils/password.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../core/utils/jwt.js";

import ApiError from "../../core/errors/ApiError.js";
import { HTTP_STATUS } from "../../core/constants/httpStatus.js";

class AuthService {
  /**
   * Register a new user
   */
  async register(userData) {
    const { firstName, lastName, email, password, role } = userData;

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

    // Create user
    const user = await authRepository.createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
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
}

export default new AuthService();