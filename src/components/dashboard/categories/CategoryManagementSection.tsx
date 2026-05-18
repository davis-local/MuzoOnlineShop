import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CategoryDto, CategoryNodeDto } from "../../../types/api";
import type { CategoryViewMode } from "../types";
import MainCard from "../../ui/MainCard";
import CategoryTable from "./CategoryTable";
import CategoryToolbar from "./CategoryToolbar";
import CategoryTreeView from "./CategoryTreeView";

interface CategoryManagementSectionProps {
  categories: CategoryDto[];
  categoryTree: CategoryNodeDto[];
  error: string | null;
  loading: boolean;
  onViewModeChange: (mode: CategoryViewMode) => void;
  viewMode: CategoryViewMode;
}

export default function CategoryManagementSection({
  categories,
  categoryTree,
  error,
  loading,
  onViewModeChange,
  viewMode,
}: CategoryManagementSectionProps) {
  const hasCategories = categories.length > 0;
  const showBusyState = loading && !hasCategories && categoryTree.length === 0;

  return (
    <Stack spacing={3}>
      <CategoryToolbar
        categoryCount={categories.length}
        onViewModeChange={onViewModeChange}
        viewMode={viewMode}
      />

      <MainCard
        subheader={
          viewMode === "table"
            ? "A flat category listing for quick scanning and parent-child reference."
            : "A hierarchical view based on the existing category tree endpoint."
        }
        title={viewMode === "table" ? "Category list" : "Category hierarchy"}
      >
        <Stack spacing={2}>
          {error ? <Alert severity="error">{error}</Alert> : null}
          {loading && hasCategories ? <LinearProgress /> : null}

          {showBusyState ? (
            <Stack
              spacing={1.5}
              sx={{
                alignItems: "center",
                justifyContent: "center",
                minHeight: 240,
              }}
            >
              <CircularProgress size={28} />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Loading categories...
              </Typography>
            </Stack>
          ) : null}

          {!showBusyState && !hasCategories ? (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              No categories have been created yet.
            </Typography>
          ) : null}

          {!showBusyState && hasCategories && viewMode === "table" ? (
            <CategoryTable categories={categories} />
          ) : null}

          {!showBusyState && hasCategories && viewMode === "tree" ? (
            categoryTree.length > 0 ? (
              <CategoryTreeView nodes={categoryTree} />
            ) : (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                No category hierarchy is available yet.
              </Typography>
            )
          ) : null}
        </Stack>
      </MainCard>
    </Stack>
  );
}
