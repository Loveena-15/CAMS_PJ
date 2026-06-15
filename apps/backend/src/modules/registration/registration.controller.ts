import { Request, Response } from 'express';
import { RegistrationService } from './registration.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/responseHandler';

export class RegistrationController {
  private registrationService: RegistrationService;

  constructor() {
    this.registrationService = new RegistrationService();
  }

  register = catchAsync(async (req: Request, res: Response) => {
    const studentId = (req as any).user.id;
    const { eventId } = req.body;
    const data = await this.registrationService.registerForEvent(studentId, eventId);
    sendResponse({
      res,
      statusCode: 201,
      message: 'Successfully registered for event',
      data,
    });
  });

  getMyRegistrations = catchAsync(async (req: Request, res: Response) => {
    const studentId = (req as any).user.id;
    const data = await this.registrationService.getMyRegistrations(studentId, req.query);
    sendResponse({
      res,
      statusCode: 200,
      message: 'Registrations retrieved successfully',
      data,
    });
  });

  getEventRegistrations = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params; // eventId
    const data = await this.registrationService.getEventRegistrations(id, req.query);
    sendResponse({
      res,
      statusCode: 200,
      message: 'Event registrations retrieved successfully',
      data,
    });
  });

  cancelRegistration = catchAsync(async (req: Request, res: Response) => {
    const studentId = (req as any).user.id;
    const { id } = req.params; // registrationId
    await this.registrationService.cancelRegistration(studentId, id);
    sendResponse({
      res,
      statusCode: 200,
      message: 'Registration cancelled successfully',
      data: null,
    });
  });
}
