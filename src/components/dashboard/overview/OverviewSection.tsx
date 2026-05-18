import { useMemo } from "react";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ArchiveBook, Box1, Category, ShoppingBag } from "iconsax-reactjs";
import Box from "@mui/material/Box";
import type { CategoryDto, ProductDto } from "../../../types/api";
import { formatCurrency } from "../../../lib/currency";
import MainCard from "../../ui/MainCard";
import DashboardMetricCard from "./DashboardMetricCard";

interface OverviewSectionProps {
  categories: CategoryDto[];
  onOpenCategories: () => void;
  onOpenProducts: () => void;
  products: ProductDto[];
}

export default function OverviewSection({
  categories,
  onOpenCategories,
  onOpenProducts,
  products,
}: OverviewSectionProps) {
  const categoryProductCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const category of categories) {
      counts.set(category.id, 0);
    }

    for (const product of products) {
      counts.set(product.categoryId, (counts.get(product.categoryId) ?? 0) + 1);
    }

    return counts;
  }, [categories, products]);

  const totalInventory = products.reduce(
    (sum, product) => sum + product.quantity,
    0,
  );
  const lowStockProducts = products.filter(
    (product) => product.quantity > 0 && product.quantity <= 5,
  );
  const outOfStockProducts = products.filter(
    (product) => product.quantity === 0,
  );
  const recentProducts = [...products]
    .sort(
      (left, right) =>
        new Date(right.updatedAt).getTime() -
        new Date(left.updatedAt).getTime(),
    )
    .slice(0, 5);
  const topCategories = [...categories]
    .sort(
      (left, right) =>
        (categoryProductCounts.get(right.id) ?? 0) -
        (categoryProductCounts.get(left.id) ?? 0),
    )
    .slice(0, 5);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} xl={3}>
        <DashboardMetricCard
          accent="primary"
          caption="Active items in the catalog"
          icon={<ShoppingBag size={20} />}
          title="products"
          value={String(products.length)}
        />
      </Grid>
      <Grid item xs={12} sm={6} xl={3}>
        <DashboardMetricCard
          accent="secondary"
          caption="Units currently available"
          icon={<ArchiveBook size={20} />}
          title="inventory"
          value={String(totalInventory)}
        />
      </Grid>
      <Grid item xs={12} sm={6} xl={3}>
        <DashboardMetricCard
          accent="success"
          caption="Categories available to assign"
          icon={<Category size={20} />}
          title="categories"
          value={String(categories.length)}
        />
      </Grid>
      <Grid item xs={12} sm={6} xl={3}>
        <DashboardMetricCard
          accent="warning"
          caption="Items that need a restock check"
          icon={<Box1 size={20} />}
          title="low stock"
          value={String(lowStockProducts.length + outOfStockProducts.length)}
        />
      </Grid>

      <Grid item xs={12} lg={7}>
        <MainCard
          secondary={
            <Button onClick={onOpenProducts} size="small">
              Manage products
            </Button>
          }
          title="Inventory spotlight"
        >
          <Stack spacing={2}>
            {recentProducts.length === 0 ? (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                No products yet. Add your first item from the products section.
              </Typography>
            ) : (
              <List disablePadding>
                {recentProducts.map((product, index) => (
                  <ListItem
                    key={product.id}
                    disableGutters
                    sx={{ py: 1.5, alignItems: "flex-start" }}
                  >
                    <ListItemText
                      primary={
                        <Stack
                          direction="row"
                          sx={{
                            alignItems: "center",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          <Typography variant="subtitle2">
                            {product.name}
                          </Typography>
                          <Chip
                            color={product.quantity > 0 ? "success" : "error"}
                            label={
                              product.quantity > 0 ? "In Stock" : "Out of Stock"
                            }
                            size="small"
                            variant="outlined"
                          />
                        </Stack>
                      }
                      secondary={
                        <Stack spacing={0.5} sx={{ mt: 0.75 }}>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            SKU {product.sku}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            {product.description || "No description added yet."}
                          </Typography>
                        </Stack>
                      }
                    />
                    <Stack sx={{ alignItems: "end", minWidth: 110, pt: 0.25 }}>
                      <Typography variant="subtitle2">
                        {formatCurrency(product.price)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        Qty {product.quantity}
                      </Typography>
                    </Stack>
                    {index < recentProducts.length - 1 ? null : null}
                  </ListItem>
                ))}
              </List>
            )}
          </Stack>
        </MainCard>
      </Grid>

      <Grid item xs={12} lg={5}>
        <MainCard
          secondary={
            <Button onClick={onOpenCategories} size="small">
              Manage categories
            </Button>
          }
          title="Category overview"
        >
          <Stack spacing={2}>
            {topCategories.length === 0 ? (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Categories will appear here once you add them.
              </Typography>
            ) : (
              topCategories.map((category, index) => (
                <Stack key={category.id} spacing={1.25}>
                  <Stack
                    direction="row"
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2">
                        {category.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {category.description || "No description"}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${categoryProductCounts.get(category.id) ?? 0} products`}
                      size="small"
                    />
                  </Stack>
                  {index < topCategories.length - 1 ? <Divider /> : null}
                </Stack>
              ))
            )}
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}
