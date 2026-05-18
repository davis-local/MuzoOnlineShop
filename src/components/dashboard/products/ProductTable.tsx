import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Edit, Trash } from "iconsax-reactjs";
import type { ProductDto } from "../../../types/api";
import { formatCurrency } from "../../../lib/currency";
import MainCard from "../../ui/MainCard";
import ProductEmptyState from "./ProductEmptyState";

interface ProductTableProps {
  categoryNameById: Record<string, string>;
  error: string | null;
  loading: boolean;
  onAddProduct: () => void;
  onDelete: (product: ProductDto) => void;
  onEdit: (product: ProductDto) => void;
  products: ProductDto[];
}

export default function ProductTable({
  categoryNameById,
  error,
  loading,
  onAddProduct,
  onDelete,
  onEdit,
  products,
}: ProductTableProps) {
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (loading) {
    return (
      <MainCard content={false}>
        <LinearProgress />
        <Stack spacing={1} sx={{ p: 2.5 }}>
          <Typography variant="subtitle2">Loading products...</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Fetching the next set of products from the API.
          </Typography>
        </Stack>
      </MainCard>
    );
  }

  if (products.length === 0) {
    return <ProductEmptyState onAddProduct={onAddProduct} />;
  }

  return (
    <MainCard content={false}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Detail</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const initials = product.name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase())
                .join("");

              return (
                <TableRow hover key={product.id}>
                  <TableCell>
                    <Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
                      <Avatar
                        sx={{
                          bgcolor: "secondary.100",
                          color: "secondary.main",
                          fontWeight: 700,
                        }}
                        variant="rounded"
                      >
                        {initials || "P"}
                      </Avatar>
                      <Stack>
                        <Typography variant="subtitle2">{product.name}</Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          {product.description || product.sku}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>{categoryNameById[product.categoryId] ?? "Unassigned"}</TableCell>
                  <TableCell align="right">{formatCurrency(product.price)}</TableCell>
                  <TableCell align="right">{product.quantity}</TableCell>
                  <TableCell>
                    <Chip
                      color={product.quantity > 0 ? "success" : "error"}
                      label={product.quantity > 0 ? "In Stock" : "Out of Stock"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton color="primary" onClick={() => onEdit(product)}>
                        <Edit size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => onDelete(product)}>
                        <Trash size={18} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
}
