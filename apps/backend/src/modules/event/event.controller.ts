import { Request, Response } from 'express';
import { EventService } from './event.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/responseHandler';

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  createEvent = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const data = await this.eventService.createEvent(req.body, userId);
    sendResponse({
      res,
      statusCode: 201,
      message: 'Event created successfully',
      data,
    });
  });

  getEvents = catchAsync(async (req: Request, res: Response) => {
    const data = await this.eventService.getEvents(req.query);
    sendResponse({
      res,
      statusCode: 200,
      message: 'Events retrieved successfully',
      data,
    });
  });

  getEventById = catchAsync(async (req: Request, res: Response) => {
    const data = await this.eventService.getEventById(req.params.id);
    sendResponse({
      res,
      statusCode: 200,
      message: 'Event retrieved successfully',
      data,
    });
  });

  updateEvent = catchAsync(async (req: Request, res: Response) => {
    const data = await this.eventService.updateEvent(req.params.id, req.body);
    sendResponse({
      res,
      statusCode: 200,
      message: 'Event updated successfully',
      data,
    });
  });

  deleteEvent = catchAsync(async (req: Request, res: Response) => {
    await this.eventService.deleteEvent(req.params.id);
    sendResponse({
      res,
      statusCode: 200,
      message: 'Event deleted successfully',
      data: null,
    });
  });
}
