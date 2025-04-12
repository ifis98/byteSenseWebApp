'use client';

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import Image from 'next/image';

const Nav2 = () => {
  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: '#f8f8f8', height: 60, justifyContent: 'center' }}>
      <Toolbar sx={{ minHeight: '60px !important', paddingLeft: '16px' }}>
        <Link href="/list" passHref>
          <IconButton edge="start" disableRipple sx={{ p: 0 }}>
            <Image
              id="drawerLogo"
              src="/image.png"
              alt="EPIC's Logo"
              width={120}
              height={40}
              style={{ objectFit: 'contain' }}
            />
          </IconButton>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Nav2;
