import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Login } from '../pages/public/Login';
import { Register } from '../pages/public/Register';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Welcome to CAMS</h1>
        <p className="text-gray-600 mb-8 max-w-md text-center">Campus Activity Management System. Manage events, track registrations, and distribute certificates seamlessly.</p>
        <div className="flex space-x-4">
          <a href="/login" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors">Sign In</a>
          <a href="/register" className="px-6 py-2 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 font-medium transition-colors">Register</a>
        </div>
      </div>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
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
