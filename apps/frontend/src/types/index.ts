export type UserRole = 'STUDENT' | 'ADMIN';
export type EventCategory = 'TECHNICAL' | 'CULTURAL' | 'SPORTS' | 'WORKSHOP' | 'SEMINAR' | 'OTHER';
export type EventStatus = 'DRAFT' | 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type Position = 'WINNER' | 'RUNNER_UP' | 'PARTICIPANT';

export interface User {
  id: string;
  fullName: string;
  email: string;
  department: string;
  academicYear: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  category: EventCategory;
  department?: string;
  venue: string;
  date: string;
  registrationDeadline: string;
  posterUrl?: string;
  status: EventStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Registration {
  id: string;
  studentId: string;
  eventId: string;
  registeredAt: string;
  event?: Event;
  student?: User;
}

export interface Result {
  id: string;
  studentId: string;
  eventId: string;
  position: Position;
  certificateUrl?: string;
  createdAt: string;
  event?: Event;
  student?: User;
}

export interface Certificate {
  id: string;
  position: Position;
  certificateUrl: string;
  event: Event;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}
