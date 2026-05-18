import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CategoryNodeDto } from "../../../types/api";

interface CategoryTreeViewProps {
  depth?: number;
  nodes: CategoryNodeDto[];
}

export default function CategoryTreeView({
  nodes,
  depth = 0,
}: CategoryTreeViewProps) {
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
