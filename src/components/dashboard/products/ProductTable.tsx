import { useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
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
  onAddProduct: () => void;
  onDelete: (product: ProductDto) => void;
  onEdit: (product: ProductDto) => void;
  products: ProductDto[];
}

export default function ProductTable({
  categoryNameById,
  error,
  onAddProduct,
  onDelete,
  onEdit,
  products,
}: ProductTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  useEffect(() => {
    setPage(0);
  }, [products.length]);

  const pagedProducts = useMemo(() => {
    const start = page * rowsPerPage;
    return products.slice(start, start + rowsPerPage);
  }, [page, products, rowsPerPage]);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
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
            {pagedProducts.map((product) => {
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

      <TablePagination
        component="div"
        count={products.length}
        onPageChange={(_, nextPage) => setPage(nextPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(0);
        }}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 8, 12]}
      />
    </MainCard>
  );
}
