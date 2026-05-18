import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CategoryViewMode } from "../types";
import MainCard from "../../ui/MainCard";

interface CategoryToolbarProps {
  categoryCount: number;
  onViewModeChange: (mode: CategoryViewMode) => void;
  viewMode: CategoryViewMode;
}

export default function CategoryToolbar({
  categoryCount,
  onViewModeChange,
  viewMode,
}: CategoryToolbarProps) {
  return (
    <MainCard content={false}>
      <Stack spacing={2} sx={{ p: 2.5 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{ alignItems: { xs: "stretch", md: "center" }, gap: 1.5 }}
        >
          <Typography sx={{ color: "text.secondary", flex: 1 }} variant="body2">
            Switch between the live tree view and the flat `/api/categories` list.
          </Typography>

          <Stack direction="row" sx={{ gap: 1 }}>
            <Button
              color={viewMode === "tree" ? "primary" : "inherit"}
              onClick={() => onViewModeChange("tree")}
              variant={viewMode === "tree" ? "contained" : "outlined"}
            >
              Tree
            </Button>
            <Button
              color={viewMode === "table" ? "primary" : "inherit"}
              onClick={() => onViewModeChange("table")}
              variant={viewMode === "table" ? "contained" : "outlined"}
            >
              Table
            </Button>
          </Stack>
        </Stack>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Showing {categoryCount} categor{categoryCount === 1 ? "y" : "ies"} from the live API.
        </Typography>
      </Stack>
    </MainCard>
  );
}
