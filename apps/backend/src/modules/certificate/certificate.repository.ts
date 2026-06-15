import prisma from '../../db';
import { Result } from '@prisma/client';

export class CertificateRepository {
  async findResultById(resultId: string) {
    return prisma.result.findUnique({
      where: { id: resultId },
      include: {
        student: { select: { id: true, fullName: true, email: true } },
        event: { select: { id: true, title: true, date: true } },
      },
    });
  }

  async findMyCertificates(studentId: string) {
    return prisma.result.findMany({
      where: {
        studentId,
        certificateUrl: { not: null },
      },
      include: {
        event: { select: { id: true, title: true, date: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateResultWithCertificate(resultId: string, url: string): Promise<Result> {
    return prisma.result.update({
      where: { id: resultId },
      data: { certificateUrl: url },
    });
  }
}
