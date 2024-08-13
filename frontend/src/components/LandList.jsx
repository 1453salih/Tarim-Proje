import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios'u import edin

const LandList = () => {
    const [lands, setLands] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = axios.defaults.headers.common['Authorization']?.split(' ')[1]; // Token'ı axios'tan alın

        if (!token) {
            console.error('Token bulunamadı.');
            return;
        }

        fetch('http://localhost:8080/lands', {
            headers: {
                'Authorization': `Bearer ${token}` // Axios'tan alınan token'ı kullanın
            }
        })
            .then(response => {
                console.log('Response:', response);
                return response.text();
            })
            .then(text => {
                console.log('Response text:', text);
                return JSON.parse(text);
            })
            .then(data => setLands(data))
            .catch(error => {
                console.error('Error fetching lands:', error);
                alert('Bir hata oluştu: ' + error.message);
            });
    }, []);

    const handleEdit = (id) => {
        navigate(`/lands/edit/${id}`);
    };

    const handleDetail = (id) => {
        navigate(`/lands/detail/${id}`);
    };

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
                                <TableCell align="right">Actions</TableCell>
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
                                    <TableCell align="right">
                                        <Button variant="contained" color="primary" onClick={() => handleEdit(land.id)}>
                                            Düzenle
                                        </Button>
                                        <Button variant="outlined" color="secondary" onClick={() => handleDetail(land.id)} sx={{ ml: 2 }}>
                                            Detay
                                        </Button>
                                    </TableCell>
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
