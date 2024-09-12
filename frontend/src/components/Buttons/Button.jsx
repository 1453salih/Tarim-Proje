import React from 'react';
import { Button } from '@mui/material';

function SquareButton({ title, onClick }) {
    return (
        <Button
            onClick={onClick}
            variant="contained"
            fullWidth
            style={{
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                backgroundColor: '#1c7946',
                color: '#fff',
                fontWeight: 'bold',
                textTransform: 'none',
                fontFamily:'Poppins,sans-serif',
                fontSize:'18px',
            }}
        >
            {title}
        </Button>
    );
}

export default SquareButton;
