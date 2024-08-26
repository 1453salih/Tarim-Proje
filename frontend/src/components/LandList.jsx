import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BreadcrumbComponent from "./BreadCrumb.jsx";

const LandList = () => {
    const [lands, setLands] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/lands', { withCredentials: true })
            .then(response => {
                setLands(response.data);
            })
            .catch(error => {
                console.error('Error fetching lands:', error);
                if (error.response && error.response.status === 401) {
                    setIsAuthenticated(false);
                }
            });
    }, []);

    if (!isAuthenticated) {
        return (
            <Container maxWidth="md">
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" color="error">
                        Oturum açmadan görüntüleyemezsiniz.
                    </Typography>
                </Box>
            </Container>
        );
    }

    const handleDetail = (id) => {
        navigate(`/lands/detail/${id}`);
    };

    return (
        <Container maxWidth="lg" sx={{marginBottom:"60px"}}>
            <Box>
                <BreadcrumbComponent pageName="Arazilerim" />
            </Box>
            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Lands List
                </Typography>
                <Grid container spacing={3}>
                    {lands.map((land) => (
                        <Grid item xs={12} sm={6} md={4} key={land.id}>
                            <Card
                                sx={{
                                    maxWidth: 345,
                                    boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.2)', // Shadow effect on the bottom-right
                                    background: 'linear-gradient(145deg, #ffffff, #f0f0f0)', // Light effect on the top-left
                                    borderRadius: '12px', // Slightly rounded corners for the raised look
                                    '&:hover': {
                                        boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.3)', // Enhanced shadow on hover
                                        transform: 'translateY(-4px)', // Slight lift on hover
                                    },
                                    padding: '16px', // Padding inside the card
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={land.imageUrl || "../../src/assets/DefaultImage/defaultLand.png"}
                                    alt={land.name}
                                    sx={{borderRadius:"8px"}}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {land.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Boyut: {land.landSize} hektar
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Şehir: {land.location.cityName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        İlçe: {land.location.districtName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Köy/Mahalle: {land.location.localityName || 'N/A'}
                                    </Typography>
                                </CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    <Button variant="contained" color="primary" onClick={() => handleDetail(land.id)}>
                                        Detay
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>

                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default LandList;
