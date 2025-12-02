import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES } from '../utils/constants';

import { LoginPage } from '../features/auth/LoginPage';
import { ProfilePage } from '../features/auth/ProfilePage';
import { ChangePasswordPage } from '../features/auth/ChangePasswordPage';

import { DashboardPage } from '../features/dashboard/DashboardPage';

import { UsersPage } from '../features/users/UsersPage';

import { ArticlesPage } from '../features/articles/ArticlesPage';
import { CreateArticlePage } from '../features/articles/CreateArticlePage';
import { EditArticlePage } from '../features/articles/EditArticlePage';

import { CategoriesPage } from '../features/categories/CategoriesPage';

import { TagsPage } from '../features/tags/TagsPage';

import { CommentsPage } from '../features/comments/CommentsPage';

import { MediaPage } from '../features/media/MediaPage';

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.HOME,
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: ROUTES.PROFILE,
        element: <ProfilePage />,
      },
      {
        path: ROUTES.CHANGE_PASSWORD,
        element: <ChangePasswordPage />,
      },
      {
        path: ROUTES.USERS,
        element: (
          <ProtectedRoute requireAdmin>
            <UsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ARTICLES,
        element: <ArticlesPage />,
      },
      {
        path: `${ROUTES.ARTICLES}/new`,
        element: <CreateArticlePage />,
      },
      {
        path: `${ROUTES.ARTICLES}/:id/edit`,
        element: <EditArticlePage />,
      },
      {
        path: ROUTES.CATEGORIES,
        element: <CategoriesPage />,
      },
      {
        path: ROUTES.TAGS,
        element: <TagsPage />,
      },
      {
        path: ROUTES.COMMENTS,
        element: <CommentsPage />,
      },
      {
        path: ROUTES.MEDIA,
        element: <MediaPage />,
      },
    ],
  },
]);
