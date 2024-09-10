import React from 'react';
import { Box, Typography } from '@mui/material';

const NoResult = () => {
    return (
        <Box sx={{ textAlign: 'center', padding: 2 }}>
            <Typography variant="h6" color="textSecondary">
                Sonuç Bulunamadı
            </Typography>
        </Box>
    );
};

export default NoResult;
