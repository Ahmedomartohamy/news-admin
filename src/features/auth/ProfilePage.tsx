import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUpdateProfile } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { toast } from 'sonner';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bio: z.string().optional(),
  profileImage: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfilePage = () => {
  const { user } = useAuthStore();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      profileImage: user?.profileImage || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile.mutateAsync(data);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={user?.email}
              disabled
            />

            <Input
              label="Role"
              type="text"
              value={user?.role}
              disabled
            />

            <Input
              label="Name"
              type="text"
              placeholder="Enter your name"
              error={errors.name?.message}
              {...register('name')}
            />

            <Textarea
              label="Bio"
              placeholder="Tell us about yourself"
              rows={4}
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

            <Button
              type="submit"
              isLoading={updateProfile.isPending}
            >
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
