import { useState } from 'react';
import { Upload, Trash2, Search } from 'lucide-react';
import { useMedia, useUploadMedia, useUploadMultipleMedia, useDeleteMedia } from '../../api/media';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Pagination } from '../../components/ui/Pagination';
import { toast } from 'sonner';

export const MediaPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const { data, isLoading } = useMedia({ page, limit: 12, search });
  const uploadMedia = useUploadMedia();
  const uploadMultiple = useUploadMultipleMedia();
  const deleteMedia = useDeleteMedia();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    try {
      if (selectedFiles.length === 1) {
        await uploadMedia.mutateAsync(selectedFiles[0]);
        toast.success('File uploaded successfully');
      } else {
        const filesArray = Array.from(selectedFiles);
        await uploadMultiple.mutateAsync(filesArray);
        toast.success(`${filesArray.length} files uploaded successfully`);
      }
      setSelectedFiles(null);
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload files');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media file?')) return;

    try {
      await deleteMedia.mutateAsync(id);
      toast.success('Media deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete media');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-1">Upload and manage media files</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              id="file-input"
              type="file"
              multiple
              onChange={handleFileChange}
              className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <Button
              onClick={handleUpload}
              isLoading={uploadMedia.isPending || uploadMultiple.isPending}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>

          {selectedFiles && selectedFiles.length > 0 && (
            <p className="text-sm text-gray-600">
              {selectedFiles.length} file(s) selected
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {isLoading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.data.map((media) => (
                <div
                  key={media.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {media.mimeType.startsWith('image/') ? (
                    <img
                      src={media.url}
                      alt={media.originalName}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-500 text-sm font-medium">
                          {media.mimeType.split('/')[1].toUpperCase()}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="p-4">
                    <p className="font-medium text-gray-900 truncate" title={media.originalName}>
                      {media.originalName}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatFileSize(media.size)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      By {media.uploadedBy.name}
                    </p>

                    <div className="flex items-center space-x-2 mt-4">
                      <button
                        onClick={() => window.open(media.url, '_blank')}
                        className="flex-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(media.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
