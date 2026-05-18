import { Form, Formik } from "formik";
import * as Yup from "yup";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import type { CategoryDto, CategoryNodeDto, CreateCategoryRequest } from "../../../types/api";
import MainCard from "../../ui/MainCard";

interface CategoryFormValues {
  description: string;
  name: string;
  parentCategoryId: string;
}

interface CategoryManagementSectionProps {
  categories: CategoryDto[];
  categoryTree: CategoryNodeDto[];
  error: string | null;
  onCreateCategory: (payload: CreateCategoryRequest) => Promise<void>;
  submitting: boolean;
  submitError: string | null;
}

const categoryValidationSchema = Yup.object({
  description: Yup.string().max(300, "Description must be 300 characters or less"),
  name: Yup.string().trim().required("Category name is required"),
  parentCategoryId: Yup.string(),
});

function CategoryTreeView({
  nodes,
  depth = 0,
}: {
  depth?: number;
  nodes: CategoryNodeDto[];
}) {
  return (
    <Stack spacing={1.5}>
      {nodes.map((node) => (
        <Stack
          key={node.id}
          spacing={1}
          sx={{
            pl: depth === 0 ? 0 : 2,
            borderLeft: depth === 0 ? "none" : "1px dashed",
            borderColor: "divider",
          }}
        >
          <Stack
            direction="row"
            sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}
          >
            <Stack spacing={0.25}>
              <Typography variant="subtitle2">{node.name}</Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {node.description || "No description"}
              </Typography>
            </Stack>
            <Chip
              label={node.children.length > 0 ? `${node.children.length} children` : "leaf"}
              size="small"
              variant="outlined"
            />
          </Stack>

          {node.children.length > 0 ? (
            <CategoryTreeView depth={depth + 1} nodes={node.children} />
          ) : null}
        </Stack>
      ))}
    </Stack>
  );
}

export default function CategoryManagementSection({
  categories,
  categoryTree,
  error,
  onCreateCategory,
  submitting,
  submitError,
}: CategoryManagementSectionProps) {
  const initialValues: CategoryFormValues = {
    description: "",
    name: "",
    parentCategoryId: "",
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={7}>
        <MainCard
          subheader="A simple category directory based on the existing template card styling."
          title="Category directory"
        >
          <Stack spacing={2}>
            {error ? <Alert severity="error">{error}</Alert> : null}
            {categoryTree.length === 0 ? (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                No categories have been created yet.
              </Typography>
            ) : (
              <CategoryTreeView nodes={categoryTree} />
            )}
          </Stack>
        </MainCard>
      </Grid>

      <Grid item xs={12} lg={5}>
        <MainCard
          subheader="This form reuses the structured add/edit card treatment from the template."
          title="Create category"
        >
          <Formik
            initialValues={initialValues}
            onSubmit={async (values, { resetForm }) => {
              await onCreateCategory({
                description: values.description.trim(),
                name: values.name.trim(),
                parentCategoryId: values.parentCategoryId || null,
              });
              resetForm();
            }}
            validationSchema={categoryValidationSchema}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              touched,
              values,
            }) => (
              <Form>
                <Stack spacing={2}>
                  {submitError ? <Alert severity="error">{submitError}</Alert> : null}

                  <div>
                    <InputLabel sx={{ mb: 1 }}>Category Name</InputLabel>
                    <TextField
                      error={Boolean(touched.name && errors.name)}
                      fullWidth
                      helperText={touched.name && errors.name ? errors.name : " "}
                      name="name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter category name"
                      value={values.name}
                    />
                  </div>

                  <div>
                    <InputLabel sx={{ mb: 1 }}>Description</InputLabel>
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
                      placeholder="Enter category description"
                      value={values.description}
                    />
                  </div>

                  <div>
                    <InputLabel sx={{ mb: 1 }}>Parent Category</InputLabel>
                    <TextField
                      fullWidth
                      name="parentCategoryId"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      select
                      value={values.parentCategoryId}
                    >
                      <MenuItem value="">No parent</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>

                  <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
                    <Button disabled={submitting} type="submit" variant="contained">
                      {submitting ? "Saving..." : "Create Category"}
                    </Button>
                  </Stack>
                </Stack>
              </Form>
            )}
          </Formik>
        </MainCard>
      </Grid>
    </Grid>
  );
}
