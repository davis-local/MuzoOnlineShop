import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Edit, Trash } from "iconsax-reactjs";
import type { ProductDto } from "../../../types/api";
import { formatCurrency } from "../../../lib/currency";
import MainCard from "../../ui/MainCard";

interface ProductGridCardProps {
  categoryName: string;
  onDelete: (product: ProductDto) => void;
  onEdit: (product: ProductDto) => void;
  product: ProductDto;
}

export default function ProductGridCard({
  categoryName,
  onDelete,
  onEdit,
  product,
}: ProductGridCardProps) {
  const initials = product.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <MainCard content={false}>
      <Box
        sx={{
          position: "relative",
          height: 180,
          px: 2.5,
          py: 2,
          background: "linear-gradient(135deg, #d7ffe8 0%, #9fe4bd 45%, #7dcea0 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" sx={{ alignItems: "start", justifyContent: "space-between" }}>
          <Chip
            color={product.quantity > 0 ? "success" : "error"}
            label={product.quantity > 0 ? "In Stock" : "Out of Stock"}
            size="small"
            variant="outlined"
          />
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
            {product.sku}
          </Typography>
        </Stack>

        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: 3,
            display: "grid",
            placeItems: "center",
            bgcolor: "rgba(255,255,255,0.7)",
            color: "#0f172a",
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-0.04em",
          }}
        >
          {initials || "P"}
        </Box>
      </Box>

      <Divider />

      <CardContent sx={{ p: 2.25 }}>
        <Stack spacing={1.5}>
          <Box>
            <Typography variant="h6" sx={{ lineHeight: 1.25 }}>
              {product.name}
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
              }}
              variant="body2"
            >
              {product.description || "No description added yet."}
            </Typography>
          </Box>

          <Stack direction="row" sx={{ justifyContent: "space-between", gap: 1 }}>
            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Category
              </Typography>
              <Typography variant="subtitle2">{categoryName}</Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Quantity
              </Typography>
              <Typography variant="subtitle2">{product.quantity}</Typography>
            </Box>
          </Stack>

          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6">{formatCurrency(product.price)}</Typography>
            <Stack direction="row" sx={{ gap: 0.5 }}>
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
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </MainCard>
  );
}
