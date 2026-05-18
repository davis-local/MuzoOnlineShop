import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import type { CategoryDto } from "../../../types/api";

interface CategoryTableProps {
  categories: CategoryDto[];
}

export default function CategoryTable({ categories }: CategoryTableProps) {
  const orderedCategories = [...categories].sort((left, right) =>
    left.name.localeCompare(right.name),
  );

  if (orderedCategories.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        No categories have been created yet.
      </Typography>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="center">Has Parent</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderedCategories.map((category) => (
            <TableRow hover key={category.id}>
              <TableCell sx={{ maxWidth: 260 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    overflowWrap: "anywhere",
                  }}
                >
                  {category.id}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">{category.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {category.description || "No description"}
                </Typography>
              </TableCell>
              <TableCell align="center">
                {category.parentCategoryId ? "Yes" : "No"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
