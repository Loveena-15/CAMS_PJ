import { ResultRepository } from './result.repository';
import { AppError } from '../../utils/AppError';
import { EventStatus, Prisma } from '@prisma/client';
import { CertificateService } from '../certificate/certificate.service';

export class ResultService {
  private repository: ResultRepository;
  private certificateService: CertificateService;

  constructor() {
    this.repository = new ResultRepository();
    this.certificateService = new CertificateService();
  }

  async assignResult(data: any) {
    const { studentId, eventId, position } = data;

    // 1. Check if event exists
    const event = await this.repository.findEventById(eventId);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // 2. Event must be COMPLETED
    if (event.status !== EventStatus.COMPLETED) {
      throw new AppError('Cannot assign results until the event is COMPLETED', 400);
    }

    // 3. Student must be registered for the event
    const registration = await this.repository.findRegistration(studentId, eventId);
    if (!registration) {
      throw new AppError('Student is not registered for this event', 400);
    }

    // 4. No duplicate result entry
    const existingResult = await this.repository.findExistingResult(studentId, eventId);
    if (existingResult) {
      throw new AppError('Result already exists for this student in this event', 409);
    }

    const result = await this.repository.create({
      studentId,
      eventId,
      position,
    });

    // Auto-generate certificate in the background
    this.certificateService.generateCertificate(result.id).catch(err => {
      console.error(`Failed to auto-generate certificate for result ${result.id}:`, err);
    });

    return result;
  }

  async getEventResults(eventId: string, query: any) {
    // Check if event exists
    const event = await this.repository.findEventById(eventId);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [total, results] = await this.repository.findResultsByEvent(eventId, skip, limit);

    return {
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getMyResults(studentId: string, query: any) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [total, results] = await this.repository.findMyResults(studentId, skip, limit);

    return {
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateResult(id: string, data: any) {
    const result = await this.repository.findById(id);
    if (!result) {
      throw new AppError('Result not found', 404);
    }

    return this.repository.update(id, data.position);
  }

  async deleteResult(id: string) {
    const result = await this.repository.findById(id);
    if (!result) {
      throw new AppError('Result not found', 404);
    }

    await this.repository.delete(id);
  }
}
