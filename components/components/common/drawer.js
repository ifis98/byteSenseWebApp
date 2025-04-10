'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Toolbar,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/PermIdentity';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

const drawerWidth = 240;

const navItems = [
  { href: '/', icon: <HomeIcon />, label: 'Home' },
  { href: '/list', icon: <PersonIcon />, label: 'Patient List' },
  { href: '/request', icon: <GroupAddIcon />, label: 'Patient Request' },
  { href: '/chat', icon: <ChatBubbleOutlineIcon />, label: 'Chat Room' },
  { href: '/alerts', icon: <MailOutlineIcon />, label: 'Alerts' },
  { href: '/help', icon: <HelpCenterIcon />, label: 'Help Center' },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#F8F8F8',
          padding: 0,
        },
      }}
    >
      <Toolbar disableGutters sx={{ justifyContent: 'center', px: 0 }}>
        <img src="/image.png" alt="Logo" style={{ width: 120 }} />
      </Toolbar>
      <List>
        {navItems.map(({ href, icon, label }) => (
          <Link key={href} href={href} passHref legacyBehavior>
            <ListItem disablePadding>
              <ListItemButton selected={pathname === href}>
                <ListItemIcon sx={{ color: '#5D82FA' }}>{icon}</ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontWeight: pathname === href ? 'bold' : 'normal',
                    color: pathname === href ? '#5D82FA' : 'inherit',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
