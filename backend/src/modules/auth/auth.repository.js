import prisma from "../../core/prisma/prisma.js";

class AuthRepository {
  /**
   * Find a user by email
   */
  async findUserByEmail(email) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  /**
   * Find a user by ID
   */
  async findUserById(id) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * Create a new user
   */
  async createUser(userData) {
    return prisma.user.create({
      data: userData,
    });
  }

  /**
   * Store refresh token
   */
  async createRefreshToken(tokenData) {
    return prisma.refreshToken.create({
      data: tokenData,
    });
  }

  /**
   * Find refresh token
   */
  async findRefreshToken(token) {
    return prisma.refreshToken.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });
  }

  /**
   * Revoke refresh token
   */
  async revokeRefreshToken(token) {
    return prisma.refreshToken.update({
      where: {
        token,
      },
      data: {
        revoked: true,
      },
    });
  }

  /**
   * Delete all refresh tokens for a user
   */
  async revokeAllUserTokens(userId) {
    return prisma.refreshToken.updateMany({
      where: {
        userId,
      },
      data: {
        revoked: true,
      },
    });
  }
}

export default new AuthRepository();