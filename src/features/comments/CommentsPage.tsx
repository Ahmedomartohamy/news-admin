import { useState } from 'react';
import { Check, X, AlertOctagon, Trash2 } from 'lucide-react';
import { useComments, useApproveComment, useRejectComment, useMarkCommentAsSpam, useDeleteComment } from '../../api/comments';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { toast } from 'sonner';

export const CommentsPage = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const { data, isLoading } = useComments({ page, limit: 10, status });
  const approveComment = useApproveComment();
  const rejectComment = useRejectComment();
  const markAsSpam = useMarkCommentAsSpam();
  const deleteComment = useDeleteComment();

  const handleApprove = async (id: string) => {
    try {
      await approveComment.mutateAsync(id);
      toast.success('Comment approved successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve comment');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectComment.mutateAsync(id);
      toast.success('Comment rejected successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject comment');
    }
  };

  const handleMarkAsSpam = async (id: string) => {
    try {
      await markAsSpam.mutateAsync(id);
      toast.success('Comment marked as spam');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to mark comment as spam');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await deleteComment.mutateAsync(id);
      toast.success('Comment deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comments Moderation</h1>
          <p className="text-gray-600 mt-1">Review and moderate user comments</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <Select
          options={[
            { value: '', label: 'All Status' },
            { value: 'PENDING', label: 'Pending' },
            { value: 'APPROVED', label: 'Approved' },
            { value: 'REJECTED', label: 'Rejected' },
            { value: 'SPAM', label: 'Spam' },
          ]}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-6 text-center text-gray-600">Loading...</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Content</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Article</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="text-sm text-gray-900">{comment.content}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{comment.user.name}</div>
                        <div className="text-sm text-gray-500">{comment.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {comment.article.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          comment.status === 'APPROVED'
                            ? 'success'
                            : comment.status === 'PENDING'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {comment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {comment.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleApprove(comment.id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {comment.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleReject(comment.id)}
                            className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        {comment.status !== 'SPAM' && (
                          <button
                            onClick={() => handleMarkAsSpam(comment.id)}
                            className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                            title="Mark as Spam"
                          >
                            <AlertOctagon className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
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
