import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateCategory, useUpdateCategory, useCategories } from '../../api/categories';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Category } from '../../types';
import { toast } from 'sonner';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
}

export const CategoryFormModal = ({ isOpen, onClose, category }: CategoryFormModalProps) => {
  const isEditing = !!category;
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const { data: categories } = useCategories();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        parentId: category.parentId || '',
      });
    } else {
      reset({
        name: '',
        slug: '',
        description: '',
        parentId: '',
      });
    }
  }, [category, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (isEditing) {
        await updateCategory.mutateAsync({ id: category.id, data });
        toast.success('Category updated successfully');
      } else {
        await createCategory.mutateAsync(data);
        toast.success('Category created successfully');
      }
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} category`);
    }
  };

  const parentOptions = [
    { value: '', label: 'No Parent' },
    ...(categories?.filter((c) => c.id !== category?.id).map((c) => ({
      value: c.id,
      label: c.name,
    })) || []),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Category' : 'Create Category'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Name"
          type="text"
          placeholder="Category name"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Slug (optional)"
          type="text"
          placeholder="category-slug"
          error={errors.slug?.message}
          {...register('slug')}
        />

        <Textarea
          label="Description"
          placeholder="Category description"
          rows={3}
          error={errors.description?.message}
          {...register('description')}
        />

        <Select
          label="Parent Category"
          options={parentOptions}
          error={errors.parentId?.message}
          {...register('parentId')}
        />

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={createCategory.isPending || updateCategory.isPending}
          >
            {isEditing ? 'Update' : 'Create'} Category
          </Button>
        </div>
      </form>
    </Modal>
  );
};
