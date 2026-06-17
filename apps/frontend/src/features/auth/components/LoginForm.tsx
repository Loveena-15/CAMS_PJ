import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginPayload } from '../types';
import { useLogin } from '../hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const LoginForm = () => {
  const { mutate: login, isPending, error: mutationError } = useLogin();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginPayload) => {
    login(data);
  };

  const errorMessage = (mutationError as any)?.response?.data?.message || mutationError?.message;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMessage && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
          {errorMessage}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <Input 
          type="email" 
          placeholder="student@college.edu" 
          {...register('email')} 
          error={errors.email?.message} 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <Input 
          type="password" 
          placeholder="••••••••" 
          {...register('password')} 
          error={errors.password?.message} 
        />
      </div>

      <Button type="submit" isLoading={isPending} className="w-full">
        Sign in
      </Button>
    </form>
  );
};
