import { Users, FileText, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { useDashboardStats, useLatestArticles } from '../../api/dashboard';
import { useCommentStats } from '../../api/comments';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const DashboardPage = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: latestArticles, isLoading: articlesLoading } = useLatestArticles();
  const { data: commentStats, isLoading: commentStatsLoading } = useCommentStats();

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Articles',
      value: stats?.articles || 0,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Comments',
      value: stats?.comments || 0,
      icon: MessageSquare,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Total Media',
      value: stats?.media || 0,
      icon: ImageIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your news website</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {statsLoading ? '...' : stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Comments Status</CardTitle>
          </CardHeader>
          <CardContent>
            {commentStatsLoading ? (
              <p className="text-gray-600">Loading...</p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending</span>
                  <Badge variant="warning">{commentStats?.pending || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Approved</span>
                  <Badge variant="success">{commentStats?.approved || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rejected</span>
                  <Badge variant="danger">{commentStats?.rejected || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Spam</span>
                  <Badge variant="danger">{commentStats?.spam || 0}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Articles</CardTitle>
          </CardHeader>
          <CardContent>
            {articlesLoading ? (
              <p className="text-gray-600">Loading...</p>
            ) : latestArticles && latestArticles.length > 0 ? (
              <div className="space-y-3">
                {latestArticles.map((article) => (
                  <div key={article.id} className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{article.title}</p>
                      <p className="text-sm text-gray-600">
                        By {article.author.name} • {new Date(article.createdAt).toLocaleDateString()}
                      </p>
                    </div>
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
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No articles yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
