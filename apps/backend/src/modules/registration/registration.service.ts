import { RegistrationRepository } from './registration.repository';
import { AppError } from '../../utils/AppError';
import { EventStatus } from '@prisma/client';

export class RegistrationService {
  private repository: RegistrationRepository;

  constructor() {
    this.repository = new RegistrationRepository();
  }

  async registerForEvent(studentId: string, eventId: string) {
    // 1. Check if event exists
    const event = await this.repository.findEventById(eventId);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // 2. Event must not be cancelled
    if (event.status === EventStatus.CANCELLED) {
      throw new AppError('Cannot register for a cancelled event', 400);
    }

    // 3. Registration must be before registrationDeadline
    if (new Date() > event.registrationDeadline) {
      throw new AppError('Registration deadline has passed', 400);
    }

    // 4. A student CANNOT register twice for the same event
    const existingRegistration = await this.repository.findExistingRegistration(studentId, eventId);
    if (existingRegistration) {
      throw new AppError('You are already registered for this event', 409);
    }

    return this.repository.create(studentId, eventId);
  }

  async getMyRegistrations(studentId: string, query: any) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [total, registrations] = await this.repository.findMyRegistrations(studentId, skip, limit);

    return {
      data: registrations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getEventRegistrations(eventId: string, query: any) {
    // Check if event exists
    const event = await this.repository.findEventById(eventId);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [total, registrations] = await this.repository.findEventRegistrations(eventId, skip, limit);

    return {
      data: registrations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async cancelRegistration(studentId: string, registrationId: string) {
    const registration = await this.repository.findById(registrationId);
    if (!registration) {
      throw new AppError('Registration not found', 404);
    }

    // Ensure student owns the registration
    if (registration.studentId !== studentId) {
      throw new AppError('You do not have permission to cancel this registration', 403);
    }

    const event = await this.repository.findEventById(registration.eventId);
    if (!event) {
      throw new AppError('Associated event not found', 404);
    }

    // Must be before deadline to cancel
    if (new Date() > event.registrationDeadline) {
      throw new AppError('Cannot cancel registration after the registration deadline', 400);
    }

    await this.repository.delete(registrationId);
  }
}
