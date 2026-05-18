import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CategoryManagementSection from "../components/dashboard/categories/CategoryManagementSection";
import CategoryFormDialog from "../components/dashboard/categories/CategoryFormDialog";
import DashboardShell from "../components/dashboard/layout/DashboardShell";
import OverviewSection from "../components/dashboard/overview/OverviewSection";
import DeleteProductDialog from "../components/dashboard/products/DeleteProductDialog";
import ProductFormDialog from "../components/dashboard/products/ProductFormDialog";
import ProductManagementSection from "../components/dashboard/products/ProductManagementSection";
import type {
  CategoryViewMode,
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

const OVERVIEW_PAGE_SIZE = 500;
const PRODUCT_PAGE_SIZE = 10;

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

export default function DashboardPage({ onLogout }: DashboardPageProps) {
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("overview");
  const [allProducts, setAllProducts] = useState<ProductDto[]>([]);
  const [pagedProducts, setPagedProducts] = useState<ProductDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryNodeDto[]>([]);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [productPage, setProductPage] = useState(1);
  const [hasNextProductPage, setHasNextProductPage] = useState(false);
  const [categoryViewMode, setCategoryViewMode] =
    useState<CategoryViewMode>("tree");
  const [viewMode, setViewMode] = useState<ProductViewMode>("grid");
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
  const [productFormSubmitting, setProductFormSubmitting] = useState(false);
  const [productFormError, setProductFormError] = useState<string | null>(null);
  const [productPendingDelete, setProductPendingDelete] =
    useState<ProductDto | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [categorySubmitting, setCategorySubmitting] = useState(false);
  const [categorySubmitError, setCategorySubmitError] = useState<string | null>(
    null,
  );

  const normalizedSearchValue = searchValue.trim();
  const productSearchQuery =
    normalizedSearchValue.length > 0 ? normalizedSearchValue : undefined;

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

  const refreshOverviewProducts = useCallback(async () => {
    setOverviewLoading(true);

    try {
      const products = await getProducts({
        page: 1,
        pageSize: OVERVIEW_PAGE_SIZE,
      });
      setAllProducts(products);
    } catch (error) {
      if (handleUnauthorized(error)) {
        return;
      }

      setProductsError(
        error instanceof ApiError ? error.message : "Unable to load products.",
      );
    } finally {
      setOverviewLoading(false);
    }
  }, [handleUnauthorized]);

  const refreshProductPage = useCallback(async () => {
    setProductsLoading(true);
    setProductsError(null);

    const baseQuery = {
      categoryId:
        selectedCategoryId === "all" ? undefined : selectedCategoryId,
      page: productPage,
      pageSize: PRODUCT_PAGE_SIZE,
      search: productSearchQuery,
    };

    try {
      const products = await getProducts(baseQuery);

      if (products.length === 0 && productPage > 1) {
        setProductPage((currentPage) => Math.max(1, currentPage - 1));
        return;
      }

      setPagedProducts(products);

      if (products.length < PRODUCT_PAGE_SIZE) {
        setHasNextProductPage(false);
        return;
      }

      const nextProducts = await getProducts({
        ...baseQuery,
        page: productPage + 1,
      });

      setHasNextProductPage(nextProducts.length > 0);
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
  }, [handleUnauthorized, productPage, productSearchQuery, selectedCategoryId]);

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

  useEffect(() => {
    if (activeSection !== "overview") {
      return;
    }

    void Promise.all([refreshOverviewProducts(), refreshCategories()]);
  }, [activeSection, refreshCategories, refreshOverviewProducts]);

  useEffect(() => {
    if (activeSection !== "categories") {
      return;
    }

    void refreshCategories();
  }, [activeSection, refreshCategories]);

  useEffect(() => {
    if (activeSection !== "products") {
      return;
    }

    void refreshCategories();
  }, [activeSection, refreshCategories]);

  useEffect(() => {
    if (activeSection !== "products") {
      return;
    }

    void refreshProductPage();
  }, [activeSection, refreshProductPage]);

  const categoryNameById = useMemo(() => {
    return categories.reduce<Record<string, string>>(
      (accumulator, category) => {
        accumulator[category.id] = category.name;
        return accumulator;
      },
      {},
    );
  }, [categories]);

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

      await Promise.all([refreshOverviewProducts(), refreshProductPage()]);
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
      await Promise.all([refreshOverviewProducts(), refreshProductPage()]);
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

  const handleOpenCategoryForm = () => {
    setCategorySubmitError(null);
    setCategoryFormOpen(true);
  };

  const handleCloseCategoryForm = () => {
    setCategorySubmitError(null);
    setCategoryFormOpen(false);
  };

  const handleCreateCategory = async (payload: CreateCategoryRequest) => {
    setCategorySubmitting(true);
    setCategorySubmitError(null);

    try {
      await createCategory(payload);
      await refreshCategories();
      handleCloseCategoryForm();
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
    overviewLoading &&
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
          : activeSection === "categories"
            ? { label: "Add Category", onClick: handleOpenCategoryForm }
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
          currentPage={productPage}
          error={productsError}
          hasNextPage={hasNextProductPage}
          loading={productsLoading}
          onAddProduct={handleOpenAddProduct}
          onCategoryChange={(categoryId) => {
            setSelectedCategoryId(categoryId);
            setProductPage(1);
          }}
          onDeleteProduct={(product) => {
            setDeleteError(null);
            setProductPendingDelete(product);
          }}
          onEditProduct={handleOpenEditProduct}
          onNextPage={() => setProductPage((currentPage) => currentPage + 1)}
          onPreviousPage={() =>
            setProductPage((currentPage) => Math.max(1, currentPage - 1))
          }
          onSearchChange={(value) => {
            setSearchValue(value);
            setProductPage(1);
          }}
          onViewModeChange={setViewMode}
          products={pagedProducts}
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
          loading={categoriesLoading}
          onViewModeChange={setCategoryViewMode}
          viewMode={categoryViewMode}
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

      <CategoryFormDialog
        categories={categories}
        onClose={handleCloseCategoryForm}
        onSubmit={handleCreateCategory}
        open={categoryFormOpen}
        submitError={categorySubmitError}
        submitting={categorySubmitting}
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
