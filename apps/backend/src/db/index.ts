import { PrismaClient } from '@prisma/client';

// Add Prisma to the NodeJS global type in development to prevent multiple instances
// due to hot reloading
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
