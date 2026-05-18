import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MainCard from "../../ui/MainCard";

interface ProductPaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  loading: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  productCount: number;
}

export default function ProductPagination({
  currentPage,
  hasNextPage,
  loading,
  onNextPage,
  onPreviousPage,
  productCount,
}: ProductPaginationProps) {
  const rangeStart = productCount === 0 ? 0 : (currentPage - 1) * 10 + 1;
  const rangeEnd = productCount === 0 ? 0 : rangeStart + productCount - 1;

  return (
    <MainCard content={false}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          alignItems: { xs: "stretch", sm: "center" },
          gap: 1.5,
          justifyContent: "space-between",
          p: 2.5,
        }}
      >
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Page {currentPage} showing {rangeStart}-{rangeEnd} with up to 10 products per page.
        </Typography>

        <Stack direction="row" sx={{ gap: 1, justifyContent: "flex-end" }}>
          <Button
            disabled={loading || currentPage === 1}
            onClick={onPreviousPage}
            variant="outlined"
          >
            Previous
          </Button>
          <Button
            disabled={loading || !hasNextPage}
            onClick={onNextPage}
            variant="contained"
          >
            Next
          </Button>
        </Stack>
      </Stack>
    </MainCard>
  );
}
