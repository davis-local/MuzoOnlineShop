import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import { Add, SearchNormal1 } from "iconsax-reactjs";
import type { CategoryDto } from "../../../types/api";
import type { ProductViewMode } from "../types";
import MainCard from "../../ui/MainCard";

interface ProductToolbarProps {
  categories: CategoryDto[];
  onAddProduct: () => void;
  onCategoryChange: (categoryId: string) => void;
  onSearchChange: (value: string) => void;
  onViewModeChange: (mode: ProductViewMode) => void;
  productCount: number;
  searchValue: string;
  selectedCategoryId: string;
  viewMode: ProductViewMode;
}

export default function ProductToolbar({
  categories,
  onAddProduct,
  onCategoryChange,
  onSearchChange,
  onViewModeChange,
  productCount,
  searchValue,
  selectedCategoryId,
  viewMode,
}: ProductToolbarProps) {
  return (
    <MainCard content={false}>
      <Stack spacing={2} sx={{ p: 2.5 }}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          sx={{ alignItems: { xs: "stretch", lg: "center" }, gap: 1.5 }}
        >
          <TextField
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products"
            size="medium"
            sx={{ flex: 1, minWidth: 240 }}
            value={searchValue}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchNormal1 size={18} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            onChange={(event) => onCategoryChange(event.target.value)}
            select
            size="medium"
            sx={{ minWidth: { xs: "100%", sm: 220 } }}
            value={selectedCategoryId}
          >
            <MenuItem value="all">All categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>

          <Stack direction="row" sx={{ gap: 1 }}>
            <Button
              color={viewMode === "grid" ? "primary" : "inherit"}
              onClick={() => onViewModeChange("grid")}
              variant={viewMode === "grid" ? "contained" : "outlined"}
            >
              Grid
            </Button>
            <Button
              color={viewMode === "table" ? "primary" : "inherit"}
              onClick={() => onViewModeChange("table")}
              variant={viewMode === "table" ? "contained" : "outlined"}
            >
              Table
            </Button>
          </Stack>

          <Button
            onClick={onAddProduct}
            startIcon={<Add size={18} />}
            variant="contained"
          >
            Add Product
          </Button>
        </Stack>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Showing {productCount} product{productCount === 1 ? "" : "s"} on the
          current page.
        </Typography>
      </Stack>
    </MainCard>
  );
}
