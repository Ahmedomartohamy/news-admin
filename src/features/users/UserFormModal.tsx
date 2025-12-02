import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateUser, useUpdateUser } from '../../api/users';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { User } from '../../types';
import { toast } from 'sonner';

const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['ADMIN', 'EDITOR', 'AUTHOR']),
  bio: z.string().optional(),
  profileImage: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}

export const UserFormModal = ({ isOpen, onClose, user }: UserFormModalProps) => {
  const isEditing = !!user;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        name: user.name,
        role: user.role,
        bio: user.bio || '',
        profileImage: user.profileImage || '',
      });
    } else {
      reset({
        email: '',
        password: '',
        name: '',
        role: 'AUTHOR',
        bio: '',
        profileImage: '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      if (isEditing) {
        await updateUser.mutateAsync({ id: user.id, data });
        toast.success('User updated successfully');
      } else {
        await createUser.mutateAsync(data as any);
        toast.success('User created successfully');
      }
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} user`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit User' : 'Create User'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="user@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        {!isEditing && (
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            error={errors.password?.message}
            {...register('password')}
          />
        )}

        <Input
          label="Name"
          type="text"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register('name')}
        />

        <Select
          label="Role"
          options={[
            { value: 'ADMIN', label: 'Admin' },
            { value: 'EDITOR', label: 'Editor' },
            { value: 'AUTHOR', label: 'Author' },
          ]}
          error={errors.role?.message}
          {...register('role')}
        />

        <Textarea
          label="Bio"
          placeholder="Tell us about this user"
          rows={3}
          error={errors.bio?.message}
          {...register('bio')}
        />

        <Input
          label="Profile Image URL"
          type="text"
          placeholder="https://example.com/image.jpg"
          error={errors.profileImage?.message}
          {...register('profileImage')}
        />

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={createUser.isPending || updateUser.isPending}
          >
            {isEditing ? 'Update' : 'Create'} User
          </Button>
        </div>
      </form>
    </Modal>
  );
};
