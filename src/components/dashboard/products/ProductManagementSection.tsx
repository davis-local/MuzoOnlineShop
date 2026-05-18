import Stack from "@mui/material/Stack";
import type { CategoryDto, ProductDto } from "../../../types/api";
import type { ProductViewMode } from "../types";
import ProductGrid from "./ProductGrid";
import ProductPagination from "./ProductPagination";
import ProductTable from "./ProductTable";
import ProductToolbar from "./ProductToolbar";

interface ProductManagementSectionProps {
  categories: CategoryDto[];
  categoryNameById: Record<string, string>;
  currentPage: number;
  error: string | null;
  hasNextPage: boolean;
  loading: boolean;
  onAddProduct: () => void;
  onCategoryChange: (categoryId: string) => void;
  onDeleteProduct: (product: ProductDto) => void;
  onEditProduct: (product: ProductDto) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onSearchChange: (value: string) => void;
  onViewModeChange: (mode: ProductViewMode) => void;
  products: ProductDto[];
  searchNeedsMoreCharacters: boolean;
  searchValue: string;
  selectedCategoryId: string;
  viewMode: ProductViewMode;
}

export default function ProductManagementSection({
  categories,
  categoryNameById,
  currentPage,
  error,
  hasNextPage,
  loading,
  onAddProduct,
  onCategoryChange,
  onDeleteProduct,
  onEditProduct,
  onNextPage,
  onPreviousPage,
  onSearchChange,
  onViewModeChange,
  products,
  searchNeedsMoreCharacters,
  searchValue,
  selectedCategoryId,
  viewMode,
}: ProductManagementSectionProps) {
  return (
    <Stack spacing={3}>
      <ProductToolbar
        categories={categories}
        onAddProduct={onAddProduct}
        onCategoryChange={onCategoryChange}
        onSearchChange={onSearchChange}
        onViewModeChange={onViewModeChange}
        productCount={products.length}
        searchNeedsMoreCharacters={searchNeedsMoreCharacters}
        searchValue={searchValue}
        selectedCategoryId={selectedCategoryId}
        viewMode={viewMode}
      />

      {viewMode === "grid" ? (
        <ProductGrid
          categoryNameById={categoryNameById}
          error={error}
          loading={loading}
          onAddProduct={onAddProduct}
          onDelete={onDeleteProduct}
          onEdit={onEditProduct}
          products={products}
        />
      ) : (
        <ProductTable
          categoryNameById={categoryNameById}
          error={error}
          loading={loading}
          onAddProduct={onAddProduct}
          onDelete={onDeleteProduct}
          onEdit={onEditProduct}
          products={products}
        />
      )}

      {!error && (loading || products.length > 0 || currentPage > 1) ? (
        <ProductPagination
          currentPage={currentPage}
          hasNextPage={hasNextPage}
          loading={loading}
          onNextPage={onNextPage}
          onPreviousPage={onPreviousPage}
          productCount={products.length}
        />
      ) : null}
    </Stack>
  );
}
