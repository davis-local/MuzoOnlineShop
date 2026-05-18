import type { ReactNode } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import type { CardHeaderProps } from "@mui/material/CardHeader";
import type { CardProps } from "@mui/material/Card";
import type { CardContentProps } from "@mui/material/CardContent";
import type { SxProps, Theme } from "@mui/material/styles";

export interface MainCardProps {
  border?: boolean;
  children?: ReactNode;
  content?: boolean;
  contentSX?: CardContentProps["sx"];
  divider?: boolean;
  secondary?: CardHeaderProps["action"];
  subheader?: ReactNode | string;
  sx?: CardProps["sx"];
  title?: ReactNode | string;
}

export default function MainCard({
  border = true,
  children,
  content = true,
  contentSX,
  divider = true,
  secondary,
  subheader,
  sx,
  title,
}: MainCardProps) {
  const baseSx: SxProps<Theme> = {
    position: "relative",
    borderRadius: 3,
    border: border ? "1px solid" : "none",
    borderColor: "divider",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
    backgroundImage: "none",
  };
  const mergedSx = (
    sx ? [baseSx, ...(Array.isArray(sx) ? sx : [sx])] : baseSx
  ) as SxProps<Theme>;

  return (
    <Card
      elevation={0}
      sx={mergedSx}
    >
      {title ? (
        <>
          <CardHeader
            action={secondary}
            subheader={subheader}
            sx={{ p: 2.5, "& .MuiCardHeader-action": { m: 0, alignSelf: "center" } }}
            title={
              typeof title === "string" ? (
                <Typography variant="subtitle1">{title}</Typography>
              ) : (
                title
              )
            }
          />
          {divider ? <Divider /> : null}
        </>
      ) : null}
      {content ? <CardContent sx={contentSX}>{children}</CardContent> : children}
    </Card>
  );
}
