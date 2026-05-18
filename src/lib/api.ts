import type {
  ApiMessageResponse,
  AuthTokenResponse,
  CategoryDto,
  CategoryNodeDto,
  CreateCategoryRequest,
  CreateProductRequest,
  LoginRequest,
  ProductDto,
  ProductQuery,
  ProductSummary,
  UpdateProductRequest,
} from "../types/api";

const DEFAULT_API_BASE_URL = "http://localhost:5079";
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL
).replace(/\/+$/, "");

export const AUTH_TOKEN_STORAGE_KEY = "muzo.auth.token";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type QueryValue = string | number | boolean | null | undefined;

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | object | null;
  token?: string | null;
}

export function getStoredToken() {
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function hasStoredToken() {
  return Boolean(getStoredToken());
}

export function setStoredToken(token: string) {
  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken() {
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

function buildUrl<TQuery extends object>(path: string, query?: TQuery) {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (!query) {
    return url.toString();
  }

  for (const [key, value] of Object.entries(query as Record<string, QueryValue>)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

async function request<T, TQuery extends object = Record<string, QueryValue>>(
  path: string,
  { body, headers, token, ...init }: RequestOptions = {},
  query?: TQuery,
) {
  const requestHeaders = new Headers(headers);
  const resolvedToken = token ?? getStoredToken();

  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json");
  }

  if (resolvedToken && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${resolvedToken}`);
  }

  let requestBody: BodyInit | null | undefined = body as BodyInit | null | undefined;

  if (
    body &&
    typeof body === "object" &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    !(body instanceof Blob)
  ) {
    requestHeaders.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(buildUrl(path, query), {
    ...init,
    headers: requestHeaders,
    body: requestBody,
  });

  if (!response.ok) {
    const errorPayload = (await parseResponse(response)) as ApiMessageResponse | string;
    const message =
      typeof errorPayload === "string"
        ? errorPayload || response.statusText
        : errorPayload.message || response.statusText;

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await parseResponse(response)) as T;
}

export async function login(payload: LoginRequest) {
  const response = await request<AuthTokenResponse>("/api/auth/login", {
    method: "POST",
    body: payload,
  });

  setStoredToken(response.token);

  return response;
}

export function getCategories() {
  return request<CategoryDto[]>("/api/categories");
}

export function getCategoryTree() {
  return request<CategoryNodeDto[]>("/api/categories/tree");
}

export function createCategory(payload: CreateCategoryRequest) {
  return request<CategoryDto>("/api/categories", {
    method: "POST",
    body: payload,
  });
}

export function getProducts(query?: ProductQuery) {
  return request<ProductDto[], ProductQuery>("/api/products", undefined, query);
}

export function getProduct(id: string) {
  return request<ProductDto>(`/api/products/${id}`);
}

export function createProduct(payload: CreateProductRequest) {
  return request<ProductDto>("/api/products", {
    method: "POST",
    body: payload,
  });
}

export function updateProduct(id: string, payload: UpdateProductRequest) {
  return request<ProductDto>(`/api/products/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export function deleteProduct(id: string) {
  return request<void>(`/api/products/${id}`, {
    method: "DELETE",
  });
}

export function manualSearchProducts(query?: Pick<ProductQuery, "page" | "pageSize" | "search">) {
  return request<ProductDto[], Pick<ProductQuery, "page" | "pageSize" | "search">>(
    "/api/products/manual-search",
    undefined,
    query,
  );
}

export function getProductSummary(id: string) {
  return request<ProductSummary>(`/api/products/${id}/summary-json`);
}
