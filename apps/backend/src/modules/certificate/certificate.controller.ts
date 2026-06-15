import { Request, Response } from 'express';
import { CertificateService } from './certificate.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/responseHandler';

export class CertificateController {
  private certificateService: CertificateService;

  constructor() {
    this.certificateService = new CertificateService();
  }

  generateCertificate = catchAsync(async (req: Request, res: Response) => {
    const { resultId } = req.body;
    const data = await this.certificateService.generateCertificate(resultId);
    sendResponse({
      res,
      statusCode: 201,
      message: 'Certificate generated successfully',
      data,
    });
  });

  getMyCertificates = catchAsync(async (req: Request, res: Response) => {
    const studentId = (req as any).user.id;
    const data = await this.certificateService.getMyCertificates(studentId);
    sendResponse({
      res,
      statusCode: 200,
      message: 'Certificates retrieved successfully',
      data,
    });
  });

  getCertificateById = catchAsync(async (req: Request, res: Response) => {
    const studentId = (req as any).user.id;
    const { id } = req.params; // resultId
    const data = await this.certificateService.getCertificateById(id, studentId);
    sendResponse({
      res,
      statusCode: 200,
      message: 'Certificate retrieved successfully',
      data,
    });
  });

  downloadCertificate = catchAsync(async (req: Request, res: Response) => {
    const studentId = (req as any).user.id;
    const { id } = req.params; // resultId
    const url = await this.certificateService.getDownloadUrl(id, studentId);
    
    // Cloudinary supports forcing attachment download via fl_attachment flag
    let downloadUrl = url;
    if (downloadUrl.includes('/upload/')) {
      downloadUrl = downloadUrl.replace('/upload/', '/upload/fl_attachment/');
    }
    
    res.redirect(downloadUrl);
  });
}
