// src/layouts/AuthLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Box } from '@mui/material';

function AuthLayout() {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Di sini halaman Login atau Register akan dirender */}
        <Outlet />
      </Box>
    </Container>
  );
}

export default AuthLayout;