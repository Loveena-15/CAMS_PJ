import { Request, Response } from 'express';
import { ResultService } from './result.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/responseHandler';

export class ResultController {
  private resultService: ResultService;

  constructor() {
    this.resultService = new ResultService();
  }

  assignResult = catchAsync(async (req: Request, res: Response) => {
    const data = await this.resultService.assignResult(req.body);
    sendResponse({
      res,
      statusCode: 201,
      message: 'Result assigned successfully',
      data,
    });
  });

  getEventResults = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params; // eventId
    const data = await this.resultService.getEventResults(id, req.query);
    sendResponse({
      res,
      statusCode: 200,
      message: 'Event results retrieved successfully',
      data,
    });
  });

  getMyResults = catchAsync(async (req: Request, res: Response) => {
    const studentId = (req as any).user.id;
    const data = await this.resultService.getMyResults(studentId, req.query);
    sendResponse({
      res,
      statusCode: 200,
      message: 'Results retrieved successfully',
      data,
    });
  });

  updateResult = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params; // resultId
    const data = await this.resultService.updateResult(id, req.body);
    sendResponse({
      res,
      statusCode: 200,
      message: 'Result updated successfully',
      data,
    });
  });

  deleteResult = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params; // resultId
    await this.resultService.deleteResult(id);
    sendResponse({
      res,
      statusCode: 200,
      message: 'Result deleted successfully',
      data: null,
    });
  });
}
