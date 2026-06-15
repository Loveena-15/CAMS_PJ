import prisma from '../../db';
import { Prisma, Result, Event, Registration } from '@prisma/client';

export class ResultRepository {
  async findEventById(eventId: string): Promise<Event | null> {
    return prisma.event.findUnique({ where: { id: eventId } });
  }

  async findRegistration(studentId: string, eventId: string): Promise<Registration | null> {
    return prisma.registration.findUnique({
      where: {
        studentId_eventId: { studentId, eventId },
      },
    });
  }

  async findExistingResult(studentId: string, eventId: string): Promise<Result | null> {
    return prisma.result.findUnique({
      where: {
        studentId_eventId: { studentId, eventId },
      },
    });
  }

  async findById(resultId: string): Promise<Result | null> {
    return prisma.result.findUnique({
      where: { id: resultId },
    });
  }

  async create(data: Prisma.ResultUncheckedCreateInput): Promise<Result> {
    return prisma.result.create({
      data,
      include: {
        student: { select: { id: true, fullName: true, email: true } },
        event: { select: { id: true, title: true } },
      },
    });
  }

  async update(id: string, position: any): Promise<Result> {
    return prisma.result.update({
      where: { id },
      data: { position },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.result.delete({ where: { id } });
  }

  async findResultsByEvent(eventId: string, skip: number, take: number) {
    return prisma.$transaction([
      prisma.result.count({ where: { eventId } }),
      prisma.result.findMany({
        where: { eventId },
        skip,
        take,
        // PostgreSQL sorts enums by definition order: WINNER -> RUNNER_UP -> PARTICIPANT
        orderBy: { position: 'asc' },
        include: {
          student: {
            select: { id: true, fullName: true, department: true },
          },
        },
      }),
    ]);
  }

  async findMyResults(studentId: string, skip: number, take: number) {
    return prisma.$transaction([
      prisma.result.count({ where: { studentId } }),
      prisma.result.findMany({
        where: { studentId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          event: {
            select: { id: true, title: true, date: true, status: true },
          },
        },
      }),
    ]);
  }
}
