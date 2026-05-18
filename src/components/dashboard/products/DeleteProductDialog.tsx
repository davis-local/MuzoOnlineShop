import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import type { ProductDto } from "../../../types/api";

interface DeleteProductDialogProps {
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  product: ProductDto | null;
  submitting: boolean;
}

export default function DeleteProductDialog({
  error,
  onClose,
  onConfirm,
  open,
  product,
  submitting,
}: DeleteProductDialogProps) {
  return (
    <Dialog onClose={onClose} open={open} PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle>Delete Product</DialogTitle>
      <DialogContent>
        {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
        <DialogContentText>
          Are you sure you want to delete{" "}
          <strong>{product?.name ?? "this product"}</strong>? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button color="secondary" onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button color="error" disabled={submitting} onClick={onConfirm} variant="contained">
          {submitting ? "Deleting..." : "Delete Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
