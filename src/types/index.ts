export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR' | 'AUTHOR';
  bio?: string;
  profileImage?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    articles: number;
    comments: number;
  };
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  categoryId?: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  _count: {
    comments: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  parent?: {
    id: string;
    name: string;
    slug: string;
  };
  children?: Category[];
  _count?: {
    articles: number;
  };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    articles: number;
  };
}

export interface Comment {
  id: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM';
  createdAt: string;
  updatedAt: string;
  userId: string;
  articleId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  article: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface Media {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  users: number;
  articles: number;
  comments: number;
  media: number;
}

export interface CommentStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  spam: number;
}

export interface MediaStats {
  total: number;
  totalSize: number;
  byMimeType: Array<{
    mimeType: string;
    count: number;
  }>;
}
