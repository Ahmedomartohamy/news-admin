import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Archive, Send } from 'lucide-react';
import { useArticles, useDeleteArticle, usePublishArticle, useArchiveArticle } from '../../api/articles';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { ROUTES } from '../../utils/constants';
import { toast } from 'sonner';

export const ArticlesPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading } = useArticles({ page, limit: 10, search, status });
  const deleteArticle = useDeleteArticle();
  const publishArticle = usePublishArticle();
  const archiveArticle = useArchiveArticle();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      await deleteArticle.mutateAsync(id);
      toast.success('Article deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete article');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await publishArticle.mutateAsync(id);
      toast.success('Article published successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to publish article');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await archiveArticle.mutateAsync(id);
      toast.success('Article archived successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to archive article');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles Management</h1>
          <p className="text-gray-600 mt-1">Manage all articles and content</p>
        </div>
        <Button onClick={() => navigate(`${ROUTES.ARTICLES}/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          New Article
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            options={[
              { value: '', label: 'All Status' },
              { value: 'DRAFT', label: 'Draft' },
              { value: 'PUBLISHED', label: 'Published' },
              { value: 'ARCHIVED', label: 'Archived' },
            ]}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-6 text-center text-gray-600">Loading...</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className="font-medium">{article.title}</div>
                      <div className="text-sm text-gray-500">{article.slug}</div>
                    </TableCell>
                    <TableCell>{article.author.name}</TableCell>
                    <TableCell>
                      {article.category ? (
                        <Badge variant="info">{article.category.name}</Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          article.status === 'PUBLISHED'
                            ? 'success'
                            : article.status === 'DRAFT'
                            ? 'warning'
                            : 'default'
                        }
                      >
                        {article.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{article.views}</TableCell>
                    <TableCell>{article._count.comments}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`${ROUTES.ARTICLES}/${article.id}/edit`)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {article.status === 'DRAFT' && (
                          <button
                            onClick={() => handlePublish(article.id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        {article.status === 'PUBLISHED' && (
                          <button
                            onClick={() => handleArchive(article.id)}
                            className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {data?.pagination && (
              <Pagination
                currentPage={data.pagination.page}
                totalPages={data.pagination.totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
