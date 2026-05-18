import { useState } from "react";
import type { ReactNode } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Add, HamburgerMenu, Logout } from "iconsax-reactjs";
import MainCard from "../../ui/MainCard";
import { dashboardNavigation } from "./navigation";
import type { DashboardSection } from "../types";

const DRAWER_WIDTH = 280;

interface DashboardShellProps {
  activeSection: DashboardSection;
  children: ReactNode;
  onLogout: () => void;
  onSectionChange: (section: DashboardSection) => void;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  subtitle: string;
  title: string;
}

export default function DashboardShell({
  activeSection,
  children,
  onLogout,
  onSectionChange,
  primaryAction,
  subtitle,
  title,
}: DashboardShellProps) {
  const isDesktop = useMediaQuery("(min-width:1200px)");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSectionClick = (section: DashboardSection) => {
    onSectionChange(section);
    setMobileOpen(false);
  };

  const drawerContent = (
    <Stack sx={{ height: "100%" }}>
      <Stack sx={{ px: 2.5, pt: 2.5, pb: 2 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, letterSpacing: "-0.04em" }}
        >
          <Box
            component="span"
            sx={{
              color: "#d7ffe8",
              textShadow: "0 2px 4px rgba(36, 36, 36, 0.2)",
            }}
          >
            Muzo
          </Box>
          <Box
            component="span"
            sx={{
              color: "#ffb067",
              textShadow: "0 2px 4px rgba(36, 36, 36, 0.2)",
            }}
          >
            Online
          </Box>
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "rgba(255, 255, 255, 0.76)", mt: 0.5 }}
        >
          Welcome to your dashboard
        </Typography>
      </Stack>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.14)" }} />

      <Box sx={{ px: 2.5, pt: 2.5 }}>
        <Typography
          variant="overline"
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            fontWeight: 700,
            letterSpacing: "0.12em",
          }}
        >
          Applications
        </Typography>
      </Box>

      <List sx={{ px: 2, py: 1.5 }}>
        {dashboardNavigation.map(({ id, title: navTitle, caption, Icon }) => {
          const selected = activeSection === id;

          return (
            <ListItemButton
              key={id}
              onClick={() => handleSectionClick(id)}
              selected={selected}
              sx={{
                borderRadius: 3,
                mb: 0.75,
                px: 1.5,
                py: 1.25,
                alignItems: "flex-start",
                border: "1px solid transparent",
                color: "rgba(255, 255, 255, 0.88)",
                "&.Mui-selected": {
                  bgcolor: "rgba(255, 255, 255, 0.14)",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.18)",
                  },
                },
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.08)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: selected ? "#ffffff" : "rgba(255, 255, 255, 0.72)",
                  mt: 0.25,
                }}
              >
                <Icon size={20} variant={selected ? "Bold" : "Linear"} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle2"
                    sx={{ textTransform: "capitalize", fontWeight: 700 }}
                  >
                    {navTitle.replaceAll("-", " ")}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255, 255, 255, 0.62)" }}
                  >
                    {caption}
                  </Typography>
                }
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ mt: "auto", p: 2 }}>
        <MainCard
          sx={{
            backgroundColor: "#0d8a4d",
            backgroundImage:
              "linear-gradient(180deg, #0f9d58 0%, #0d8a4d 52%, #0b7a44 100%)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            color: "#ffffff",
          }}
          title="Logged In As Store Admin"
        >
          <Button
            color="error"
            fullWidth
            onClick={onLogout}
            startIcon={<Logout size={18} />}
            variant="contained"
          >
            Logout
          </Button>
        </MainCard>
      </Box>
    </Stack>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb" }}>
      <AppBar
        color="inherit"
        elevation={0}
        position="fixed"
        sx={{
          width: {
            lg: `calc(100% - ${DRAWER_WIDTH}px)`,
          },
          ml: { lg: `${DRAWER_WIDTH}px` },
          color: "#2f2418",
          backgroundColor: "white",
          backgroundImage: "none",
          borderBottom: "1px solid rgba(137, 73, 10, 0.1)",
          boxShadow: "0 14px 34px rgba(255, 176, 103, 0.3)",
        }}
      >
        <Toolbar sx={{ minHeight: 80, px: { xs: 2, md: 3 } }}>
          <Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
            {!isDesktop ? (
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setMobileOpen(true)}
                sx={{
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "rgba(89, 52, 16, 0.18)",
                }}
              >
                <HamburgerMenu size={18} />
              </IconButton>
            ) : null}
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  textTransform: "capitalize",
                  textAlign: "left",
                  color: "#2f2418",
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(47, 36, 24, 0.72)" }}
              >
                {subtitle}
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            sx={{ alignItems: "center", gap: 1.25, ml: "auto" }}
          >
            {primaryAction ? (
              <Button
                onClick={primaryAction.onClick}
                startIcon={<Add size={18} />}
                variant="contained"
              >
                {primaryAction.label}
              </Button>
            ) : null}
            <Button
              color="inherit"
              onClick={onLogout}
              startIcon={<Logout size={18} />}
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Drawer
          open={isDesktop ? true : mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              borderRight: "1px solid rgba(255, 255, 255, 0.08)",
              backgroundColor: "#0d8a4d",
              backgroundImage:
                "linear-gradient(180deg, #0f9d58 0%, #0d8a4d 52%, #0b7a44 100%)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              color: "#ffffff",
            },
          }}
          variant={isDesktop ? "permanent" : "temporary"}
        >
          {drawerContent}
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          }}
        >
          <Toolbar sx={{ minHeight: "80px !important" }} />
          <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
