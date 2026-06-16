import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">CAMS Landing Page</h1>
        <a href="/login" className="text-blue-500 hover:underline">Go to Login</a>
      </div>
    ),
  },
  {
    path: '/login',
    element: <div className="p-8 font-bold">Login Page (Pending Implementation)</div>,
  },
  {
    path: '/student',
    element: <ProtectedRoute allowedRoles={['STUDENT']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: 'home', element: <div>Student Dashboard Home</div> },
          { path: 'registrations', element: <div>Student Registrations</div> },
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
          { path: 'events', element: <div>Admin Events Management</div> },
        ],
      },
    ],
  },
]);
