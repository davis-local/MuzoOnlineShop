import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import type { ProductDto } from "../../../types/api";
import ProductCardSkeleton from "./ProductCardSkeleton";
import ProductEmptyState from "./ProductEmptyState";
import ProductGridCard from "./ProductGridCard";

interface ProductGridProps {
  categoryNameById: Record<string, string>;
  error: string | null;
  loading: boolean;
  onAddProduct: () => void;
  onDelete: (product: ProductDto) => void;
  onEdit: (product: ProductDto) => void;
  products: ProductDto[];
}

export default function ProductGrid({
  categoryNameById,
  error,
  loading,
  onAddProduct,
  onDelete,
  onEdit,
  products,
}: ProductGridProps) {
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (loading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid item key={index} xs={12} md={6} xl={4}>
            <ProductCardSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (products.length === 0) {
    return <ProductEmptyState onAddProduct={onAddProduct} />;
  }

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item key={product.id} xs={12} md={6} xl={4}>
          <ProductGridCard
            categoryName={categoryNameById[product.categoryId] ?? "Unassigned"}
            onDelete={onDelete}
            onEdit={onEdit}
            product={product}
          />
        </Grid>
      ))}
    </Grid>
  );
}
