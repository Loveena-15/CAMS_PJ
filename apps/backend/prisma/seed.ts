import { PrismaClient, UserRole, EventCategory, EventStatus, Position } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Default hashed password for testing ("password123")
  const defaultPasswordHash = '$2b$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm';

  // 1. Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cams.edu' },
    update: {},
    create: {
      fullName: 'System Administrator',
      email: 'admin@cams.edu',
      password: defaultPasswordHash,
      department: 'Administration',
      academicYear: 'N/A',
      role: UserRole.ADMIN,
    },
  });
  console.log(`Admin created: ${admin.email}`);

  // 2. Create Students
  const student1 = await prisma.user.upsert({
    where: { email: 'student1@cams.edu' },
    update: {},
    create: {
      fullName: 'Alice Smith',
      email: 'student1@cams.edu',
      password: defaultPasswordHash,
      department: 'Computer Science',
      academicYear: 'SY',
      role: UserRole.STUDENT,
    },
  });
  console.log(`Student created: ${student1.email}`);

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@cams.edu' },
    update: {},
    create: {
      fullName: 'Bob Jones',
      email: 'student2@cams.edu',
      password: defaultPasswordHash,
      department: 'Information Technology',
      academicYear: 'TY',
      role: UserRole.STUDENT,
    },
  });
  console.log(`Student created: ${student2.email}`);

  // 3. Create Events
  const upcomingDate = new Date();
  upcomingDate.setDate(upcomingDate.getDate() + 30);
  const upcomingDeadline = new Date(upcomingDate);
  upcomingDeadline.setDate(upcomingDeadline.getDate() - 5);

  let upcomingEvent = await prisma.event.findFirst({ where: { title: 'Hackathon 2026' } });
  if (!upcomingEvent) {
    upcomingEvent = await prisma.event.create({
      data: {
        title: 'Hackathon 2026',
        description: 'Annual 24-hour coding challenge.',
        category: EventCategory.TECHNICAL,
        department: 'Computer Science',
        venue: 'Main Lab',
        date: upcomingDate,
        registrationDeadline: upcomingDeadline,
        status: EventStatus.UPCOMING,
        createdBy: admin.id,
      },
    });
    console.log(`Event created: ${upcomingEvent.title}`);
  }

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 30);
  const pastDeadline = new Date(pastDate);
  pastDeadline.setDate(pastDeadline.getDate() - 5);

  let pastEvent = await prisma.event.findFirst({ where: { title: 'Web Dev Workshop' } });
  if (!pastEvent) {
    pastEvent = await prisma.event.create({
      data: {
        title: 'Web Dev Workshop',
        description: 'Introduction to React and Next.js',
        category: EventCategory.WORKSHOP,
        department: 'Information Technology',
        venue: 'Seminar Hall 1',
        date: pastDate,
        registrationDeadline: pastDeadline,
        status: EventStatus.COMPLETED,
        createdBy: admin.id,
      },
    });
    console.log(`Event created: ${pastEvent.title}`);
  }

  // 4. Create Registrations
  const reg1 = await prisma.registration.findUnique({
    where: {
      studentId_eventId: { studentId: student1.id, eventId: upcomingEvent.id }
    }
  });
  if (!reg1) {
    await prisma.registration.create({
      data: { studentId: student1.id, eventId: upcomingEvent.id }
    });
    console.log(`Registration created: ${student1.fullName} -> ${upcomingEvent.title}`);
  }

  const reg2 = await prisma.registration.findUnique({
    where: {
      studentId_eventId: { studentId: student2.id, eventId: pastEvent.id }
    }
  });
  if (!reg2) {
    await prisma.registration.create({
      data: { studentId: student2.id, eventId: pastEvent.id }
    });
    console.log(`Registration created: ${student2.fullName} -> ${pastEvent.title}`);
  }

  // 5. Create Results
  const result1 = await prisma.result.findUnique({
    where: {
      studentId_eventId: { studentId: student2.id, eventId: pastEvent.id }
    }
  });
  if (!result1) {
    await prisma.result.create({
      data: {
        studentId: student2.id,
        eventId: pastEvent.id,
        position: Position.WINNER,
      }
    });
    console.log(`Result created: ${student2.fullName} won ${pastEvent.title}`);
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
