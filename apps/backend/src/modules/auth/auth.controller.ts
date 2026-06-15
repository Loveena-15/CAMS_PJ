import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/responseHandler';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = catchAsync(async (req: Request, res: Response) => {
    const data = await this.authService.register(req.body);
    sendResponse({
      res,
      statusCode: 201,
      message: 'User registered successfully',
      data,
    });
  });

  login = catchAsync(async (req: Request, res: Response) => {
    const data = await this.authService.login(req.body);
    sendResponse({
      res,
      statusCode: 200,
      message: 'Login successful',
      data,
    });
  });

  refresh = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const data = await this.authService.refresh(refreshToken);
    sendResponse({
      res,
      statusCode: 200,
      message: 'Token refreshed successfully',
      data,
    });
  });

  logout = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    await this.authService.logout(refreshToken);
    sendResponse({
      res,
      statusCode: 200,
      message: 'Logged out successfully',
    });
  });

  getMe = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const data = await this.authService.getMe(userId);
    sendResponse({
      res,
      statusCode: 200,
      message: 'Profile retrieved',
      data,
    });
  });
}
