import { Link, Navigate } from 'react-router-dom';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { useAuthStore } from '@/store/authStore';

export const Register = () => {
  const { user } = useAuthStore();

  if (user) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin/home' : '/student/home'} replace />;
  }

  return (
    <div className="flex flex-col justify-center py-16 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Student Registration
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};
