import Stack from "@mui/material/Stack";
import type { CategoryDto, ProductDto } from "../../../types/api";
import type { ProductViewMode } from "../types";
import ProductGrid from "./ProductGrid";
import ProductTable from "./ProductTable";
import ProductToolbar from "./ProductToolbar";

interface ProductManagementSectionProps {
  categories: CategoryDto[];
  categoryNameById: Record<string, string>;
  error: string | null;
  loading: boolean;
  onAddProduct: () => void;
  onCategoryChange: (categoryId: string) => void;
  onDeleteProduct: (product: ProductDto) => void;
  onEditProduct: (product: ProductDto) => void;
  onSearchChange: (value: string) => void;
  onViewModeChange: (mode: ProductViewMode) => void;
  products: ProductDto[];
  searchValue: string;
  selectedCategoryId: string;
  viewMode: ProductViewMode;
}

export default function ProductManagementSection({
  categories,
  categoryNameById,
  error,
  loading,
  onAddProduct,
  onCategoryChange,
  onDeleteProduct,
  onEditProduct,
  onSearchChange,
  onViewModeChange,
  products,
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
          onAddProduct={onAddProduct}
          onDelete={onDeleteProduct}
          onEdit={onEditProduct}
          products={products}
        />
      )}
    </Stack>
  );
}
