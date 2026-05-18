import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ArrowRight2, ShoppingBag } from "iconsax-reactjs";
import MainCard from "../../ui/MainCard";

interface ProductEmptyStateProps {
  onAddProduct?: () => void;
  title?: string;
}

export default function ProductEmptyState({
  onAddProduct,
  title = "There is no Product",
}: ProductEmptyStateProps) {
  return (
    <MainCard>
      <Stack
        spacing={2}
        sx={{ alignItems: "center", justifyContent: "center", minHeight: 320, textAlign: "center" }}
      >
        <Box
          sx={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            bgcolor: "secondary.100",
            color: "secondary.main",
          }}
        >
          <ShoppingBag size={36} />
        </Box>
        <Stack spacing={0.75}>
          <Typography variant="h5">{title}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 420 }}>
            Try checking your spelling, changing the category filter, or add a new product to start building the catalog.
          </Typography>
        </Stack>
        {onAddProduct ? (
          <Button
            color="secondary"
            endIcon={<ArrowRight2 size={18} />}
            onClick={onAddProduct}
            variant="contained"
          >
            Add Product
          </Button>
        ) : null}
      </Stack>
    </MainCard>
  );
}
