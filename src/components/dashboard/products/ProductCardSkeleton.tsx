import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import MainCard from "../../ui/MainCard";

export default function ProductCardSkeleton() {
  return (
    <MainCard content={false}>
      <Skeleton height={180} variant="rectangular" />
      <CardContent sx={{ p: 2 }}>
        <Grid container spacing={1.5}>
          <Grid item xs={12}>
            <Skeleton height={24} variant="rounded" width="60%" />
          </Grid>
          <Grid item xs={12}>
            <Skeleton height={18} variant="rounded" width="85%" />
            <Skeleton height={18} sx={{ mt: 0.75 }} variant="rounded" width="55%" />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
              <Skeleton height={18} variant="rounded" width={90} />
              <Skeleton height={18} variant="rounded" width={70} />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" sx={{ gap: 1, justifyContent: "space-between" }}>
              <Skeleton height={36} variant="rounded" width="48%" />
              <Skeleton height={36} variant="rounded" width="48%" />
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
}
