export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  token: string;
  expiresAt: string;
}

export interface CategoryDto {
  id: string;
  name: string;
  description: string;
  parentCategoryId: string | null;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  parentCategoryId: string | null;
}

export interface CategoryNodeDto {
  id: string;
  name: string;
  description: string;
  parentCategoryId: string | null;
  children: CategoryNodeDto[];
}

export interface ProductDto {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  quantity: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  sku: string;
  price: number;
  quantity: number;
  categoryId: string;
}

export interface UpdateProductRequest {
  name: string;
  description: string;
  sku: string;
  price: number;
  quantity: number;
  categoryId: string;
}

export interface ProductQuery {
  page?: number;
  pageSize?: number;
  search?: string | null;
  categoryId?: string | null;
}

export interface ProductSummary {
  id: string;
  name: string;
  sku: string;
  price: number;
  inStock: boolean;
}

export interface ApiMessageResponse {
  message?: string;
}
