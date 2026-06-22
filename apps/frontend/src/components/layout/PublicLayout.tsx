import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export const PublicLayout = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-blue-600 tracking-tight">CAMS Platform</Link>
          <div className="flex items-center space-x-6">
            <Link to="/events" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Events Catalog</Link>
            {user ? (
              <Link 
                to={user.role === 'ADMIN' ? '/admin/home' : '/student/home'} 
                className="text-sm font-medium px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Sign In</Link>
                <Link to="/register" className="text-sm font-medium px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition-all">Register</Link>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      
      <footer className="bg-white border-t py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} Campus Activity Management System. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
