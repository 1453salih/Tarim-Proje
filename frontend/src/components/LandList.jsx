import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const LandList = () => {
    const [lands, setLands] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/lands')
            .then(response => response.json())
            .then(data => setLands(data))
            .catch(error => console.error('Error fetching lands:', error));
    }, []);

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Lands List
                </Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="lands table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Size (hectares)</TableCell>
                                <TableCell align="right">City</TableCell>
                                <TableCell align="right">District</TableCell>
                                <TableCell align="right">Village</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lands.map((land) => (
                                <TableRow key={land.id}>
                                    <TableCell component="th" scope="row">
                                        {land.name}
                                    </TableCell>
                                    <TableCell align="right">{land.landSize}</TableCell>
                                    <TableCell align="right">{land.city}</TableCell>
                                    <TableCell align="right">{land.district}</TableCell>
                                    <TableCell align="right">{land.village || 'N/A'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};

export default LandList;
