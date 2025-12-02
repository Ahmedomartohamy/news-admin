import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useTags, useDeleteTag } from '../../api/tags';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { TagFormModal } from './TagFormModal';
import { toast } from 'sonner';
import { Tag } from '../../types';

export const TagsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const { data: tags, isLoading } = useTags();
  const deleteTag = useDeleteTag();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;

    try {
      await deleteTag.mutateAsync(id);
      toast.success('Tag deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete tag');
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTag(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tags Management</h1>
          <p className="text-gray-600 mt-1">Manage article tags</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tag
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-6 text-center text-gray-600">Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags?.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    <div className="font-medium">{tag.name}</div>
                  </TableCell>
                  <TableCell>{tag.slug}</TableCell>
                  <TableCell>{tag._count?.articles || 0}</TableCell>
                  <TableCell>
                    {new Date(tag.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(tag)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tag.id)}
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
        )}
      </div>

      <TagFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        tag={editingTag}
      />
    </div>
  );
};
