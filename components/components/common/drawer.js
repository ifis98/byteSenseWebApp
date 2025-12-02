"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Toolbar,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/PermIdentity";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";

const drawerWidth = 240;

const navItems = [
  { href: "/", icon: <HomeIcon />, label: "Dashboard" },
  // { href: '/order', icon: <GroupAddIcon />, label: 'Order' },
  { href: "/order-list", icon: <GroupAddIcon />, label: "Order List" },
  // NOTE: Patient List and Consumer Request pages are intentionally hidden from the
  // sidebar for now. Please keep these entries commented out so the pages can be
  // quickly reactivated later and so automated cleanup tools or AI coders do not
  // delete them as unused code.
  // { href: "/list", icon: <PersonIcon />, label: "Patient List" },
  // { href: "/request", icon: <GroupAddIcon />, label: "Consumer Request" },
  // { href: '/chat', icon: <ChatBubbleOutlineIcon />, label: 'Chat Room' },
  //{ href: '/alerts', icon: <MailOutlineIcon />, label: 'Alerts' },
  //{ href: '/help', icon: <HelpCenterIcon />, label: 'Help Center' },
];

const bottomNavItems = [
  { href: "/lab_slip", label: "Quick Start" },
  { href: "/product_information", label: "Product Information" },
  { href: "/sales_material", label: "Sales Materials" },
  { href: "/policies", label: "Policies" },
  // { href: "/faq", label: "FAQ" },
  { href: "/staff_training", label: "Staff Training" },
];
const faqNavItems = [
  { href: "/consumer", label: "Consumer FAQ" },
  { href: "/office", label: "Office FAQ" },
];

const Sidebar = ({ variant = "permanent", drawerOpen, onClick }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(true);
  const [faqOpen, setFaqOpen] = React.useState(true);

  React.useEffect(() => {
    setOpen(localStorage.getItem("open"));
    setFaqOpen(localStorage.getItem("faqOpen"));
  }, []);

  const handleNavigation = (href) => {
    // Use router.push to force navigation.
    // This ensures that if the target URL is the same path but with a different or missing hash,
    // the navigation will trigger a re-render.
    router.push(href);
  };

  return (
    <Drawer
      variant={variant}
      open={drawerOpen}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#000",
          padding: 0,
          color: "#ffffff",
        },
      }}
      onClick={onClick}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          paddingBottom: "10px",
        }}
      >
        <div>
          <Toolbar disableGutters sx={{ justifyContent: "center", px: 0 }}>
            <img src="/image.png" alt="Logo" style={{ width: 120 }} />
          </Toolbar>
          <List>
            {navItems.map(({ href, icon, label }) => (
              <ListItem
                key={href}
                disablePadding
                onClick={() => handleNavigation(href)}
                button
              >
                <ListItemButton selected={pathname === href}>
                  <ListItemIcon
                    sx={{ color: pathname === href ? "#ef5350" : "#fff" }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontWeight: pathname === href ? "bold" : "normal",
                      color: pathname === href ? "#ef5350" : "inherit",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>

        <div
          style={{
            borderRadius: 10,
            border: "1px solid #181818",
            padding: 10,
            margin: "0 10px",
            background: open
              ? "radial-gradient(at bottom right,#441a19,#101010)"
              : "transparent",
          }}
        >
          <ListItem
            disablePadding
            button
            onClick={() => {
              localStorage.setItem("open", !open);
              setOpen((prev) => !prev);
            }}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ListItemText
              primary={"Playbook"}
              primaryTypographyProps={{
                fontWeight: "normal",
                color: "inherit",
              }}
              style={{
                padding: "8px 16px",
                borderBottom: "2px solid #181818",
              }}
            />
            <KeyboardArrowDownIcon
              style={{ transform: !open ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </ListItem>
          {open && (
            <List>
              {bottomNavItems.map(({ href, icon, label }) => (
                <ListItem
                  key={href}
                  disablePadding
                  onClick={() => handleNavigation(href)}
                  button
                >
                  <ListItemButton selected={pathname === href}>
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{
                        fontWeight: pathname === href ? "bold" : "normal",
                        color: pathname === href ? "#ef5350" : "inherit",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
          <ListItem
            disablePadding
            button
            onClick={() => {
              localStorage.setItem("faqOpen", !faqOpen);
              setFaqOpen((prev) => !prev);
            }}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ListItemText
              primary={"FAQ"}
              primaryTypographyProps={{
                fontWeight: "normal",
                color: "inherit",
              }}
              style={{
                padding: "8px 16px",
                borderBottom: "2px solid #18181847",
              }}
            />
            <KeyboardArrowDownIcon
              style={{
                transform: !faqOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </ListItem>
          {faqOpen && (
            <List>
              {faqNavItems.map(({ href, icon, label }) => (
                <ListItem
                  key={href}
                  disablePadding
                  onClick={() => handleNavigation(href)}
                  button
                >
                  <ListItemButton selected={pathname === href}>
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{
                        fontWeight: pathname === href ? "bold" : "normal",
                        color: pathname === href ? "#ef5350" : "inherit",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
          <ListItem
            key={"/contact_support"}
            disablePadding
            onClick={() => handleNavigation("/contact_support")}
            button
          >
            <ListItemButton selected={pathname === "/contact_support"}>
              <ListItemText
                primary={"Contact Support"}
                primaryTypographyProps={{
                  fontWeight:
                    pathname === "/contact_support" ? "bold" : "normal",
                  color:
                    pathname === "/contact_support" ? "#ef5350" : "inherit",
                }}
              />
            </ListItemButton>
          </ListItem>
        </div>
      </div>
    </Drawer>
  );
};

export default Sidebar;
