import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #ddd',
        position: 'fixed',
        bottom: 0,
        width: '100%',
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} TimeSheetApp. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;