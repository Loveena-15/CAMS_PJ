import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../features/auth/hooks/useAuth';
import { LogOut, Home, Calendar, Award, FileText } from 'lucide-react';
import clsx from 'clsx';

export const DashboardLayout = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const { mutate: logoutUser, isPending: isLoggingOut } = useLogout();

  const handleLogout = () => {
    logoutUser();
  };

  const studentLinks = [
    { to: '/student/home', label: 'Dashboard', icon: <Home size={20} /> },
    { to: '/student/registrations', label: 'Registrations', icon: <Calendar size={20} /> },
    { to: '/student/results', label: 'Results', icon: <Award size={20} /> },
    { to: '/student/certificates', label: 'Certificates', icon: <FileText size={20} /> },
  ];

  const adminLinks = [
    { to: '/admin/home', label: 'Dashboard', icon: <Home size={20} /> },
    { to: '/admin/events', label: 'Manage Events', icon: <Calendar size={20} /> },
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : studentLinks;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">CAMS Platform</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={clsx(
                  "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                  isActive 
                    ? "bg-blue-50 text-blue-700 font-medium" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                )}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
          <h2 className="text-lg font-medium text-gray-800">Welcome, {user?.fullName}</h2>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-semibold tracking-wide text-blue-700 bg-blue-100 px-3 py-1 rounded-full uppercase">
              {user?.role}
            </span>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              <LogOut size={18} />
              <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
