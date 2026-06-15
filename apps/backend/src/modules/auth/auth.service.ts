import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRepository } from './auth.repository';
import { AppError } from '../../utils/AppError';
import { config } from '../../config/env';

export class AuthService {
  private repository: AuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }

  private generateAccessToken(userId: string, role: string) {
    return jwt.sign({ id: userId, role }, config.jwtSecret, { expiresIn: '15m' });
  }

  private generateRefreshToken(userId: string) {
    return jwt.sign({ id: userId }, config.jwtRefreshSecret, { expiresIn: '7d' });
  }

  async register(data: any) {
    const existingUser = await this.repository.findUserByEmail(data.email);
    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.repository.createUser({
      fullName: data.fullName,
      email: data.email,
      password: hashedPassword,
      department: data.department,
      academicYear: data.academicYear,
      role: 'STUDENT', // Force student role on register
    });

    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.repository.createRefreshToken(user.id, refreshToken, expiresAt);

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async login(data: any) {
    const user = await this.repository.findUserByEmail(data.email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.repository.createRefreshToken(user.id, refreshToken, expiresAt);

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
    } catch (err) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const dbToken = await this.repository.findRefreshToken(refreshToken);
    if (!dbToken) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const user = await this.repository.findUserById(decoded.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Rotate refresh token
    await this.repository.deleteRefreshToken(refreshToken);

    const newAccessToken = this.generateAccessToken(user.id, user.role);
    const newRefreshToken = this.generateRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.repository.createRefreshToken(user.id, newRefreshToken, expiresAt);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    const dbToken = await this.repository.findRefreshToken(refreshToken);
    if (dbToken) {
      await this.repository.deleteRefreshToken(refreshToken);
    }
  }

  async getMe(userId: string) {
    const user = await this.repository.findUserById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
