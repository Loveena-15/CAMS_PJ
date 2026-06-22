import { Link, Navigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuthStore } from '@/store/authStore';

export const Login = () => {
  const { user } = useAuthStore();

  // If already logged in, redirect to correct home
  if (user) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin/home' : '/student/home'} replace />;
  }

  return (
    <div className="flex flex-col justify-center py-16 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to CAMS
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            register as a new student
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};
