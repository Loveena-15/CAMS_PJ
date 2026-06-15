import prisma from '../../db';
import { Prisma, Registration, Event } from '@prisma/client';

export class RegistrationRepository {
  async findEventById(eventId: string): Promise<Event | null> {
    return prisma.event.findUnique({ where: { id: eventId } });
  }

  async findExistingRegistration(studentId: string, eventId: string): Promise<Registration | null> {
    return prisma.registration.findUnique({
      where: {
        studentId_eventId: { studentId, eventId },
      },
    });
  }

  async findById(registrationId: string): Promise<Registration | null> {
    return prisma.registration.findUnique({
      where: { id: registrationId },
    });
  }

  async create(studentId: string, eventId: string): Promise<Registration> {
    return prisma.registration.create({
      data: {
        studentId,
        eventId,
      },
      include: {
        event: {
          select: { id: true, title: true, date: true, status: true, venue: true },
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.registration.delete({ where: { id } });
  }

  async findMyRegistrations(studentId: string, skip: number, take: number) {
    return prisma.$transaction([
      prisma.registration.count({ where: { studentId } }),
      prisma.registration.findMany({
        where: { studentId },
        skip,
        take,
        orderBy: { registeredAt: 'desc' },
        include: {
          event: {
            select: { id: true, title: true, date: true, status: true, venue: true },
          },
        },
      }),
    ]);
  }

  async findEventRegistrations(eventId: string, skip: number, take: number) {
    return prisma.$transaction([
      prisma.registration.count({ where: { eventId } }),
      prisma.registration.findMany({
        where: { eventId },
        skip,
        take,
        orderBy: { registeredAt: 'desc' },
        include: {
          student: {
            select: { id: true, fullName: true, email: true, department: true },
          },
        },
      }),
    ]);
  }
}
