import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateArticle } from '../../api/articles';
import { useCategories } from '../../api/categories';
import { useTags } from '../../api/tags';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ROUTES } from '../../utils/constants';
import { toast } from 'sonner';

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  featuredImage: z.string().url('Invalid URL').optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  categoryId: z.string().optional(),
  tagIds: z.string().optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

export const CreateArticlePage = () => {
  const navigate = useNavigate();
  const createArticle = useCreateArticle();
  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      status: 'DRAFT',
    },
  });

  const onSubmit = async (data: ArticleFormData) => {
    try {
      const tagIds = data.tagIds ? data.tagIds.split(',').map((id) => id.trim()) : [];

      await createArticle.mutateAsync({
        ...data,
        tagIds,
        categoryId: data.categoryId || undefined,
      });

      toast.success('Article created successfully');
      navigate(ROUTES.ARTICLES);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create article');
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Article</h1>
        <p className="text-gray-600 mt-1">Write and publish your article</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Title"
              type="text"
              placeholder="Enter article title"
              error={errors.title?.message}
              {...register('title')}
            />

            <Textarea
              label="Excerpt"
              placeholder="Brief summary of the article"
              rows={2}
              error={errors.excerpt?.message}
              {...register('excerpt')}
            />

            <Textarea
              label="Content"
              placeholder="Write your article content here"
              rows={12}
              error={errors.content?.message}
              {...register('content')}
            />

            <Input
              label="Featured Image URL"
              type="text"
              placeholder="https://example.com/image.jpg"
              error={errors.featuredImage?.message}
              {...register('featuredImage')}
            />

            <Select
              label="Category"
              options={[
                { value: '', label: 'No Category' },
                ...(categories?.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                })) || []),
              ]}
              error={errors.categoryId?.message}
              {...register('categoryId')}
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Tags (comma-separated IDs)
              </label>
              <Input
                type="text"
                placeholder="tag-id-1, tag-id-2, tag-id-3"
                error={errors.tagIds?.message}
                {...register('tagIds')}
              />
              {tags && tags.length > 0 && (
                <p className="text-xs text-gray-500">
                  Available tags: {tags.map((t) => `${t.name} (${t.id})`).join(', ')}
                </p>
              )}
            </div>

            <Select
              label="Status"
              options={[
                { value: 'DRAFT', label: 'Draft' },
                { value: 'PUBLISHED', label: 'Published' },
                { value: 'ARCHIVED', label: 'Archived' },
              ]}
              error={errors.status?.message}
              {...register('status')}
            />

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(ROUTES.ARTICLES)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={createArticle.isPending}>
                Create Article
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
