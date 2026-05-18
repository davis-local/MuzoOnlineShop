import { Form, Formik } from "formik";
import * as Yup from "yup";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type {
  CategoryDto,
  CreateProductRequest,
  ProductDto,
  UpdateProductRequest,
} from "../../../types/api";
import MainCard from "../../ui/MainCard";

interface ProductFormValues {
  categoryId: string;
  description: string;
  name: string;
  price: string;
  quantity: string;
  sku: string;
}

interface ProductFormDialogProps {
  categories: CategoryDto[];
  onClose: () => void;
  onSubmit: (payload: CreateProductRequest | UpdateProductRequest) => Promise<void>;
  open: boolean;
  product: ProductDto | null;
  submitError: string | null;
  submitting: boolean;
}

const validationSchema = Yup.object({
  categoryId: Yup.string().required("Category is required"),
  description: Yup.string().max(500, "Description must be 500 characters or less"),
  name: Yup.string().trim().required("Product name is required"),
  price: Yup.number()
    .typeError("Price must be a valid number")
    .moreThan(0, "Price must be greater than zero")
    .required("Price is required"),
  quantity: Yup.number()
    .typeError("Quantity must be a valid number")
    .min(0, "Quantity cannot be negative")
    .required("Quantity is required"),
  sku: Yup.string().trim().required("SKU is required"),
});

export default function ProductFormDialog({
  categories,
  onClose,
  onSubmit,
  open,
  product,
  submitError,
  submitting,
}: ProductFormDialogProps) {
  const initialValues: ProductFormValues = {
    categoryId: product?.categoryId ?? "",
    description: product?.description ?? "",
    name: product?.name ?? "",
    price: product ? String(product.price) : "",
    quantity: product ? String(product.quantity) : "0",
    sku: product?.sku ?? "",
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        {product ? "Edit Product" : "Add New Product"}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={async (values) => {
            await onSubmit({
              categoryId: values.categoryId,
              description: values.description.trim(),
              name: values.name.trim(),
              price: Number(values.price),
              quantity: Number(values.quantity),
              sku: values.sku.trim(),
            });
          }}
          validationSchema={validationSchema}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            touched,
            values,
          }) => (
            <Form>
              <Stack spacing={2.5}>
                {submitError ? <Alert severity="error">{submitError}</Alert> : null}
                {categories.length === 0 ? (
                  <Alert severity="warning">
                    Create at least one category before adding a product.
                  </Alert>
                ) : null}

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MainCard title="Basic Details">
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <InputLabel sx={{ mb: 1 }}>Product Name</InputLabel>
                          <TextField
                            error={Boolean(touched.name && errors.name)}
                            fullWidth
                            helperText={touched.name && errors.name ? errors.name : " "}
                            name="name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter product name"
                            value={values.name}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <InputLabel sx={{ mb: 1 }}>Product Description</InputLabel>
                          <TextField
                            error={Boolean(touched.description && errors.description)}
                            fullWidth
                            helperText={
                              touched.description && errors.description
                                ? errors.description
                                : " "
                            }
                            minRows={4}
                            multiline
                            name="description"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter product description"
                            value={values.description}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <InputLabel sx={{ mb: 1 }}>Category</InputLabel>
                          <TextField
                            error={Boolean(touched.categoryId && errors.categoryId)}
                            fullWidth
                            helperText={
                              touched.categoryId && errors.categoryId
                                ? errors.categoryId
                                : " "
                            }
                            name="categoryId"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            select
                            value={values.categoryId}
                          >
                            {categories.map((category) => (
                              <MenuItem key={category.id} value={category.id}>
                                {category.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <MainCard title="Inventory">
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <InputLabel sx={{ mb: 1 }}>SKU</InputLabel>
                          <TextField
                            error={Boolean(touched.sku && errors.sku)}
                            fullWidth
                            helperText={touched.sku && errors.sku ? errors.sku : " "}
                            name="sku"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter SKU"
                            value={values.sku}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <InputLabel sx={{ mb: 1 }}>Price</InputLabel>
                          <TextField
                            error={Boolean(touched.price && errors.price)}
                            fullWidth
                            helperText={touched.price && errors.price ? errors.price : " "}
                            name="price"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter price"
                            type="number"
                            value={values.price}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <InputLabel sx={{ mb: 1 }}>Quantity</InputLabel>
                          <TextField
                            error={Boolean(touched.quantity && errors.quantity)}
                            fullWidth
                            helperText={
                              touched.quantity && errors.quantity ? errors.quantity : " "
                            }
                            name="quantity"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter quantity"
                            type="number"
                            value={values.quantity}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography sx={{ color: "error.main" }} variant="caption">
                            *{" "}
                            <Typography component="span" sx={{ color: "text.secondary" }} variant="caption">
                              The layout is adapted from the template add-product view and now submits to your live API.
                            </Typography>
                          </Typography>
                        </Grid>
                      </Grid>
                    </MainCard>
                  </Grid>
                </Grid>

                <Stack
                  direction="row"
                  sx={{ alignItems: "center", gap: 1.5, justifyContent: "flex-end" }}
                >
                  <Button color="secondary" onClick={onClose} variant="outlined">
                    Cancel
                  </Button>
                  <Button
                    disabled={submitting || categories.length === 0}
                    type="submit"
                    variant="contained"
                  >
                    {submitting
                      ? "Saving..."
                      : product
                        ? "Save Changes"
                        : "Add new Product"}
                  </Button>
                </Stack>
              </Stack>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
