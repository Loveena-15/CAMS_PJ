import prisma from '../../db';
import { Prisma, Event } from '@prisma/client';

export class EventRepository {
  async create(data: Prisma.EventUncheckedCreateInput): Promise<Event> {
    return prisma.event.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    return prisma.$transaction([
      prisma.event.count({ where }),
      prisma.event.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          creator: {
            select: { id: true, fullName: true, email: true },
          },
        },
      }),
    ]);
  }

  async findById(id: string): Promise<Event | null> {
    return prisma.event.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, fullName: true },
        },
        _count: {
          select: { registrations: true },
        },
      },
    });
  }

  async update(id: string, data: Prisma.EventUpdateInput): Promise<Event> {
    return prisma.event.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Event> {
    // The DB schema does not have a `deletedAt` flag for soft deletion.
    // Hard deleting based on the instructions (fallback).
    return prisma.event.delete({ where: { id } });
  }
}
