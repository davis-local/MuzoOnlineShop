import { Form, Formik } from "formik";
import * as Yup from "yup";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import type { CategoryDto, CreateCategoryRequest } from "../../../types/api";
import MainCard from "../../ui/MainCard";

interface CategoryFormValues {
  description: string;
  name: string;
  parentCategoryId: string;
}

interface CategoryFormDialogProps {
  categories: CategoryDto[];
  onClose: () => void;
  onSubmit: (payload: CreateCategoryRequest) => Promise<void>;
  open: boolean;
  submitError: string | null;
  submitting: boolean;
}

const validationSchema = Yup.object({
  description: Yup.string().max(300, "Description must be 300 characters or less"),
  name: Yup.string().trim().required("Category name is required"),
  parentCategoryId: Yup.string(),
});

export default function CategoryFormDialog({
  categories,
  onClose,
  onSubmit,
  open,
  submitError,
  submitting,
}: CategoryFormDialogProps) {
  const initialValues: CategoryFormValues = {
    description: "",
    name: "",
    parentCategoryId: "",
  };

  const sortedCategories = [...categories].sort((left, right) =>
    left.name.localeCompare(right.name),
  );

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ pb: 0 }}>Add New Category</DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={async (values) => {
            await onSubmit({
              description: values.description.trim(),
              name: values.name.trim(),
              parentCategoryId: values.parentCategoryId || null,
            });
          }}
          validationSchema={validationSchema}
        >
          {({ errors, handleBlur, handleChange, touched, values }) => (
            <Form>
              <Stack spacing={2.5}>
                {submitError ? <Alert severity="error">{submitError}</Alert> : null}

                <MainCard
                  subheader="Create a root category or attach this one under an existing parent."
                  title="Category Details"
                >
                  <Stack spacing={2}>
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
                        {sortedCategories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </Stack>
                </MainCard>

                <Stack
                  direction="row"
                  sx={{ alignItems: "center", gap: 1.5, justifyContent: "flex-end" }}
                >
                  <Button color="secondary" onClick={onClose} variant="outlined">
                    Cancel
                  </Button>
                  <Button disabled={submitting} type="submit" variant="contained">
                    {submitting ? "Saving..." : "Create Category"}
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
