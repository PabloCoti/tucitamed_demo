"use client";

import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Tooltip,
  Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const drawerWidth = 260;
const collapsedWidth = 72;

const navItems = [
  {
    text: "Dashboard",
    href: "/doctor/",
    icon: <DashboardIcon fontSize="medium" />,
  },
  {
    text: "Citas",
    href: "/doctor/appointments/list",
    icon: <CalendarMonthIcon fontSize="medium" />,
  },
  {
    text: "Pacientes",
    href: "/doctor/patients/list",
    icon: <PeopleIcon fontSize="medium" />,
  },
];

export default function DoctorLayout({ children }) {
  const theme = useTheme();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const toggleMobileDrawer = () => {
    setMobileOpen(!mobileOpen);
  };
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          px: 1.5,
          minHeight: 56,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {!collapsed && (
          <Typography
            variant="subtitle1"
            noWrap
            component="div"
            sx={{ fontWeight: "600" }}
          >
            Panel Doctor
          </Typography>
        )}
        <IconButton
          size="small"
          onClick={toggleCollapse}
          edge="end"
          aria-label="Colapsar menú"
        >
          {collapsed ? (
            <ChevronRightIcon fontSize="small" />
          ) : (
            <ChevronLeftIcon fontSize="small" />
          )}
        </IconButton>
      </Toolbar>

      <List sx={{ flexGrow: 1, py: 0.5 }}>
        {navItems.map(({ text, href, icon }) => {
          const selected = pathname === href;
          return (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <Tooltip title={collapsed ? text : ""} placement="right" arrow>
                <ListItemButton
                  component={Link}
                  href={href}
                  selected={selected}
                  sx={{
                    minHeight: 40,
                    justifyContent: collapsed ? "center" : "flex-start",
                    px: collapsed ? 1 : 2.5,
                    borderRadius: 1.5,
                    mb: 0.5,
                    color: selected
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                    fontSize: "0.9rem",
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: collapsed ? 0 : 2,
                      justifyContent: "center",
                      color: "inherit",
                      fontSize: "1.2rem",
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{
                        fontSize: "0.95rem",
                        fontWeight: 500,
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 1.5, borderTop: `1px solid ${theme.palette.divider}` }}>
        {!collapsed && (
          <Typography
            variant="caption"
            color="text.secondary"
            align="center"
            sx={{ fontSize: "0.75rem" }}
          >
            © 2025 Dr. Pablo Cotí
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: {
            sm: `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)`,
          },
          ml: { sm: `${collapsed ? collapsedWidth : drawerWidth}px` },
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar variant="dense">
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleMobileDrawer}
              sx={{ mr: 1 }}
              aria-label="Abrir menú"
              size="small"
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          )}
          <Typography
            variant="subtitle1"
            noWrap
            component="div"
            sx={{ fontWeight: "600" }}
          >
            Panel del Doctor
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleMobileDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", sm: "block" },
          width: collapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: collapsed ? collapsedWidth : drawerWidth,
            boxSizing: "border-box",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
            overflowX: "hidden",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          mt: 7,
          width: {
            sm: `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)`,
          },
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
