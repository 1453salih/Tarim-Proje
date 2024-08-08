import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Box } from '@mui/material';

const LandList = () => {
    const [lands, setLands] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/lands')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setLands(data);
                } else {
                    console.error('Expected an array but got:', data);
                }
            })
            .catch(error => console.error('Error fetching lands:', error));
    }, []);

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Lands List
                </Typography>
                <List>
                    {lands.map((land) => (
                        <ListItem key={land.id}>
                            <ListItemText
                                primary={land.name}
                                secondary={`Size: ${land.landSize} hectares, City: ${land.city}, District: ${land.district}, Village: ${land.village || 'N/A'}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container>
    );
};

export default LandList;
