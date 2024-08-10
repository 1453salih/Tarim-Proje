import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';

const LandDetails = () => {
    const { id } = useParams();
    const [land, setLand] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/lands/detail/${id}`)
            .then(response => response.json())
            .then(data => setLand(data))
            .catch(error => console.error('Error fetching land details:', error));
    }, [id]);

    if (!land) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    {land.name} Details
                </Typography>
                <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6">Size: {land.landSize} hectares</Typography>
                    <Typography variant="h6">City: {land.city}</Typography>
                    <Typography variant="h6">District: {land.district}</Typography>
                    <Typography variant="h6">Village: {land.village || 'N/A'}</Typography>
                </Paper>
            </Box>
        </Container>
    );
};

export default LandDetails;

