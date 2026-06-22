import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Login } from '../pages/public/Login';
import { Register } from '../pages/public/Register';
import { Events } from '../pages/public/Events';
import { EventDetails } from '../pages/public/EventDetails';
import { AdminEvents } from '../pages/admin/AdminEvents';
import { CreateEvent } from '../pages/admin/CreateEvent';
import { EditEvent } from '../pages/admin/EditEvent';
import { MyRegistrations } from '../pages/student/MyRegistrations';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/events" replace />,
      },
      {
        path: 'events',
        element: <Events />,
      },
      {
        path: 'events/:id',
        element: <EventDetails />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ]
  },
  {
    path: '/student',
    element: <ProtectedRoute allowedRoles={['STUDENT']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: 'home', element: <div>Student Dashboard Home</div> },
          { path: 'registrations', element: <MyRegistrations /> },
          { path: 'results', element: <div>Student Results</div> },
          { path: 'certificates', element: <div>Student Certificates</div> },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute allowedRoles={['ADMIN']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: 'home', element: <div>Admin Dashboard Home</div> },
          { path: 'events', element: <AdminEvents /> },
          { path: 'events/create', element: <CreateEvent /> },
          { path: 'events/:id/edit', element: <EditEvent /> },
        ],
      },
    ],
  },
]);
