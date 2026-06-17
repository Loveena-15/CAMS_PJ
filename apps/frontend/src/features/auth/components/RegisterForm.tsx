import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterPayload } from '../types';
import { useRegister } from '../hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const RegisterForm = () => {
  const { mutate: registerUser, isPending, error: mutationError } = useRegister();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterPayload) => {
    registerUser(data);
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <Input 
          type="text" 
          placeholder="John Doe" 
          {...register('fullName')} 
          error={errors.fullName?.message} 
        />
      </div>

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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <Input 
            type="text" 
            placeholder="e.g. Computer Science" 
            {...register('department')} 
            error={errors.department?.message} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
          <Input 
            type="text" 
            placeholder="e.g. 3rd Year" 
            {...register('academicYear')} 
            error={errors.academicYear?.message} 
          />
        </div>
      </div>

      <Button type="submit" isLoading={isPending} className="w-full">
        Create Account
      </Button>
    </form>
  );
};
