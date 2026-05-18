import type { ReactNode } from "react";
import { alpha } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MainCard from "../../ui/MainCard";

interface DashboardMetricCardProps {
  accent: "primary" | "secondary" | "success" | "warning";
  caption: string;
  icon: ReactNode;
  title: string;
  value: string;
}

export default function DashboardMetricCard({
  accent,
  caption,
  icon,
  title,
  value,
}: DashboardMetricCardProps) {
  return (
    <MainCard>
      <Stack spacing={2}>
        <Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={(theme) => ({
              bgcolor: alpha(theme.palette[accent].main, 0.12),
              color: `${accent}.main`,
              width: 44,
              height: 44,
            })}
            variant="rounded"
          >
            {icon}
          </Avatar>
          <Typography variant="subtitle1" sx={{ textTransform: "capitalize" }}>
            {title}
          </Typography>
        </Stack>

        <MainCard
          border={false}
          contentSX={{ py: 2.5 }}
          sx={{
            backgroundColor: "#0d8a4d",
            backgroundImage:
              "linear-gradient(180deg, #0f9d58 0%, #0d8a4d 52%, #0b7a44 100%)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            color: "#ffffff",
          }}
        >
          <Stack
            direction="row"
            sx={{ alignItems: "end", justifyContent: "space-between" }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff" }}>
                {value}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.76)", mt: 0.5 }}
              >
                {caption}
              </Typography>
            </Box>
          </Stack>
        </MainCard>
      </Stack>
    </MainCard>
  );
}
