import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CategoryManagementSection from "../components/dashboard/categories/CategoryManagementSection";
import DashboardShell from "../components/dashboard/layout/DashboardShell";
import OverviewSection from "../components/dashboard/overview/OverviewSection";
import DeleteProductDialog from "../components/dashboard/products/DeleteProductDialog";
import ProductFormDialog from "../components/dashboard/products/ProductFormDialog";
import ProductManagementSection from "../components/dashboard/products/ProductManagementSection";
import type {
  DashboardSection,
  ProductViewMode,
} from "../components/dashboard/types";
import {
  ApiError,
  clearStoredToken,
  createCategory,
  createProduct,
  deleteProduct,
  getCategories,
  getCategoryTree,
  getProducts,
  updateProduct,
} from "../lib/api";
import type {
  CategoryDto,
  CategoryNodeDto,
  CreateCategoryRequest,
  CreateProductRequest,
  ProductDto,
  UpdateProductRequest,
} from "../types/api";

interface DashboardPageProps {
  onLogout: () => void;
}

function getSectionCopy(section: DashboardSection) {
  switch (section) {
    case "products":
      return {
        subtitle:
          "Grid and table views adapted to your inventory management needs, with powerful search and filtering capabilities.",
        title: "product management",
      };
    case "categories":
      return {
        subtitle:
          "Keep product groupings organized with a simple management surface.",
        title: "category management",
      };
    case "overview":
    default:
      return {
        subtitle:
          "Muzo Online dashboard template built with React and Material-UI.",
        title: "dashboard",
      };
  }
}

function matchesProductSearch(product: ProductDto, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return [product.name, product.description, product.sku].some((value) =>
    value.toLowerCase().includes(normalizedQuery),
  );
}

export default function DashboardPage({ onLogout }: DashboardPageProps) {
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("overview");
  const [allProducts, setAllProducts] = useState<ProductDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryNodeDto[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [viewMode, setViewMode] = useState<ProductViewMode>("grid");
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
  const [productFormSubmitting, setProductFormSubmitting] = useState(false);
  const [productFormError, setProductFormError] = useState<string | null>(null);
  const [productPendingDelete, setProductPendingDelete] =
    useState<ProductDto | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [categorySubmitting, setCategorySubmitting] = useState(false);
  const [categorySubmitError, setCategorySubmitError] = useState<string | null>(
    null,
  );

  const deferredSearchValue = useDeferredValue(searchValue);

  const handleUnauthorized = useCallback(
    (error: unknown) => {
      if (error instanceof ApiError && error.status === 401) {
        clearStoredToken();
        onLogout();
        return true;
      }

      return false;
    },
    [onLogout],
  );

  const refreshProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError(null);

    try {
      const products = await getProducts({ page: 1, pageSize: 100 });
      setAllProducts(products);
    } catch (error) {
      if (handleUnauthorized(error)) {
        return;
      }

      setProductsError(
        error instanceof ApiError ? error.message : "Unable to load products.",
      );
    } finally {
      setProductsLoading(false);
    }
  }, [handleUnauthorized]);

  const refreshCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);

    try {
      const [categoryList, categoryTreeData] = await Promise.all([
        getCategories(),
        getCategoryTree(),
      ]);

      setCategories(categoryList);
      setCategoryTree(categoryTreeData);
    } catch (error) {
      if (handleUnauthorized(error)) {
        return;
      }

      setCategoriesError(
        error instanceof ApiError
          ? error.message
          : "Unable to load categories.",
      );
    } finally {
      setCategoriesLoading(false);
    }
  }, [handleUnauthorized]);

  const loadDashboardData = useCallback(async () => {
    await Promise.all([refreshProducts(), refreshCategories()]);
  }, [refreshCategories, refreshProducts]);

  useEffect(() => {
    void loadDashboardData();
  }, [loadDashboardData]);

  const categoryNameById = useMemo(() => {
    return categories.reduce<Record<string, string>>(
      (accumulator, category) => {
        accumulator[category.id] = category.name;
        return accumulator;
      },
      {},
    );
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((product) => matchesProductSearch(product, deferredSearchValue))
      .filter((product) =>
        selectedCategoryId === "all"
          ? true
          : product.categoryId === selectedCategoryId,
      )
      .sort(
        (left, right) =>
          new Date(right.updatedAt).getTime() -
          new Date(left.updatedAt).getTime(),
      );
  }, [allProducts, deferredSearchValue, selectedCategoryId]);

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormError(null);
    setProductFormOpen(true);
  };

  const handleOpenEditProduct = (product: ProductDto) => {
    setEditingProduct(product);
    setProductFormError(null);
    setProductFormOpen(true);
  };

  const handleCloseProductForm = () => {
    setEditingProduct(null);
    setProductFormError(null);
    setProductFormOpen(false);
  };

  const handleProductSubmit = async (
    payload: CreateProductRequest | UpdateProductRequest,
  ) => {
    setProductFormSubmitting(true);
    setProductFormError(null);

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }

      await refreshProducts();
      handleCloseProductForm();
    } catch (error) {
      if (handleUnauthorized(error)) {
        return;
      }

      setProductFormError(
        error instanceof ApiError ? error.message : "Unable to save product.",
      );
    } finally {
      setProductFormSubmitting(false);
    }
  };

  const handleConfirmDeleteProduct = async () => {
    if (!productPendingDelete) {
      return;
    }

    setDeleteSubmitting(true);
    setDeleteError(null);

    try {
      await deleteProduct(productPendingDelete.id);
      await refreshProducts();
      setProductPendingDelete(null);
    } catch (error) {
      if (handleUnauthorized(error)) {
        return;
      }

      setDeleteError(
        error instanceof ApiError ? error.message : "Unable to delete product.",
      );
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const handleCreateCategory = async (payload: CreateCategoryRequest) => {
    setCategorySubmitting(true);
    setCategorySubmitError(null);

    try {
      await createCategory(payload);
      await refreshCategories();
    } catch (error) {
      if (handleUnauthorized(error)) {
        return;
      }

      setCategorySubmitError(
        error instanceof ApiError
          ? error.message
          : "Unable to create category.",
      );
      throw error;
    } finally {
      setCategorySubmitting(false);
    }
  };

  const handleLogout = () => {
    clearStoredToken();
    onLogout();
  };

  const sectionCopy = getSectionCopy(activeSection);
  const dashboardBusy =
    productsLoading &&
    categoriesLoading &&
    allProducts.length === 0 &&
    categories.length === 0;

  return (
    <DashboardShell
      activeSection={activeSection}
      onLogout={handleLogout}
      onSectionChange={setActiveSection}
      primaryAction={
        activeSection === "products"
          ? { label: "Add Product", onClick: handleOpenAddProduct }
          : undefined
      }
      subtitle={sectionCopy.subtitle}
      title={sectionCopy.title}
    >
      {dashboardBusy ? (
        <Stack
          spacing={1.5}
          sx={{
            alignItems: "center",
            justifyContent: "center",
            minHeight: 420,
          }}
        >
          <CircularProgress />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Loading your dashboard...
          </Typography>
        </Stack>
      ) : null}

      {!dashboardBusy && activeSection === "overview" ? (
        <OverviewSection
          categories={categories}
          onOpenCategories={() => setActiveSection("categories")}
          onOpenProducts={() => setActiveSection("products")}
          products={allProducts}
        />
      ) : null}

      {!dashboardBusy && activeSection === "products" ? (
        <ProductManagementSection
          categories={categories}
          categoryNameById={categoryNameById}
          error={productsError}
          loading={productsLoading}
          onAddProduct={handleOpenAddProduct}
          onCategoryChange={setSelectedCategoryId}
          onDeleteProduct={(product) => {
            setDeleteError(null);
            setProductPendingDelete(product);
          }}
          onEditProduct={handleOpenEditProduct}
          onSearchChange={(value) => {
            startTransition(() => {
              setSearchValue(value);
            });
          }}
          onViewModeChange={setViewMode}
          products={filteredProducts}
          searchValue={searchValue}
          selectedCategoryId={selectedCategoryId}
          viewMode={viewMode}
        />
      ) : null}

      {!dashboardBusy && activeSection === "categories" ? (
        <CategoryManagementSection
          categories={categories}
          categoryTree={categoryTree}
          error={categoriesError}
          onCreateCategory={handleCreateCategory}
          submitError={categorySubmitError}
          submitting={categorySubmitting}
        />
      ) : null}

      <ProductFormDialog
        categories={categories}
        onClose={handleCloseProductForm}
        onSubmit={handleProductSubmit}
        open={productFormOpen}
        product={editingProduct}
        submitError={productFormError}
        submitting={productFormSubmitting}
      />

      <DeleteProductDialog
        error={deleteError}
        onClose={() => {
          setDeleteError(null);
          setProductPendingDelete(null);
        }}
        onConfirm={handleConfirmDeleteProduct}
        open={Boolean(productPendingDelete)}
        product={productPendingDelete}
        submitting={deleteSubmitting}
      />
    </DashboardShell>
  );
}
