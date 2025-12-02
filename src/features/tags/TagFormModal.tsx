import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateTag, useUpdateTag } from '../../api/tags';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Tag } from '../../types';
import { toast } from 'sonner';

const tagSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional(),
});

type TagFormData = z.infer<typeof tagSchema>;

interface TagFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag?: Tag | null;
}

export const TagFormModal = ({ isOpen, onClose, tag }: TagFormModalProps) => {
  const isEditing = !!tag;
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
  });

  useEffect(() => {
    if (tag) {
      reset({
        name: tag.name,
        slug: tag.slug,
      });
    } else {
      reset({
        name: '',
        slug: '',
      });
    }
  }, [tag, reset]);

  const onSubmit = async (data: TagFormData) => {
    try {
      if (isEditing) {
        await updateTag.mutateAsync({ id: tag.id, data });
        toast.success('Tag updated successfully');
      } else {
        await createTag.mutateAsync(data);
        toast.success('Tag created successfully');
      }
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} tag`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Tag' : 'Create Tag'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Name"
          type="text"
          placeholder="Tag name"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Slug (optional)"
          type="text"
          placeholder="tag-slug"
          error={errors.slug?.message}
          {...register('slug')}
        />

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={createTag.isPending || updateTag.isPending}
          >
            {isEditing ? 'Update' : 'Create'} Tag
          </Button>
        </div>
      </form>
    </Modal>
  );
};
