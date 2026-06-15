import { EventRepository } from './event.repository';
import { AppError } from '../../utils/AppError';
import { Prisma } from '@prisma/client';

export class EventService {
  private repository: EventRepository;

  constructor() {
    this.repository = new EventRepository();
  }

  async createEvent(data: any, userId: string) {
    const eventData: Prisma.EventUncheckedCreateInput = {
      ...data,
      date: new Date(data.date),
      registrationDeadline: new Date(data.registrationDeadline),
      createdBy: userId,
    };
    return this.repository.create(eventData);
  }

  async getEvents(query: any) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.EventWhereInput = {};

    if (query.search) {
      where.title = { contains: query.search, mode: 'insensitive' };
    }
    if (query.category) {
      where.category = query.category;
    }
    if (query.department) {
      where.department = query.department;
    }
    if (query.status) {
      where.status = query.status;
    }

    const [total, events] = await this.repository.findAll({
      skip,
      take: limit,
      where,
      orderBy: { date: 'asc' }, // default sort chronologically
    });

    return {
      data: events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getEventById(id: string) {
    const event = await this.repository.findById(id);
    if (!event) {
      throw new AppError('Event not found', 404);
    }
    return event;
  }

  async updateEvent(id: string, data: any) {
    const event = await this.repository.findById(id);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Validate logic if dates are partially updated
    const date = data.date ? new Date(data.date) : event.date;
    const deadline = data.registrationDeadline ? new Date(data.registrationDeadline) : event.registrationDeadline;
    if (deadline >= date) {
      throw new AppError('Registration deadline must be before the event date', 400);
    }

    const updateData: Prisma.EventUpdateInput = {
      ...data,
      ...(data.date && { date: new Date(data.date) }),
      ...(data.registrationDeadline && { registrationDeadline: new Date(data.registrationDeadline) }),
    };

    return this.repository.update(id, updateData);
  }

  async deleteEvent(id: string) {
    const event = await this.repository.findById(id);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    return this.repository.delete(id);
  }
}
