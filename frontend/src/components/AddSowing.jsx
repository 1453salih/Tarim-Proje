import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, MenuItem, FormControl, InputLabel, Select, Snackbar, Alert, Grid, Card, CardContent, CardMedia } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BreadcrumbComponent from "./BreadCrumb";
import { green } from "@mui/material/colors";

function AddSowing() {
    const [plantId, setPlantId] = useState('');
    const [sowingDate, setSowingDate] = useState('');
    const [landId, setLandId] = useState('');
    const [plants, setPlants] = useState([]);
    const [lands, setLands] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [recommendations, setRecommendations] = useState([]); // Öneriler için state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/categories', { withCredentials: true });
                setCategories(response.data);
            } catch (error) {
                console.log("Error Fetching Categories", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            const fetchPlantsByCategory = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/plants/by-category?categoryId=${selectedCategory}`, { withCredentials: true });
                    setPlants(response.data);
                } catch (error) {
                    console.log("Error Fetching Plants", error);
                }
            };

            fetchPlantsByCategory();
        }
    }, [selectedCategory]);

    useEffect(() => {
        const fetchPlantsAndLands = async () => {
            try {
                const [plantsResponse, landsResponse] = await Promise.all([
                    axios.get('http://localhost:8080/plants', { withCredentials: true }),
                    axios.get('http://localhost:8080/lands', { withCredentials: true })
                ]);
                setPlants(plantsResponse.data);
                setLands(landsResponse.data);
            } catch (error) {
                console.error('Error fetching plants and lands:', error);
            }
        };

        fetchPlantsAndLands();
    }, []);

    useEffect(() => {
        if (landId && plantId) {
            const fetchRecommendations = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/recommendations?landId=${landId}&plantId=${plantId}`, { withCredentials: true });
                    setRecommendations(response.data);
                } catch (error) {
                    console.log("Error Fetching Recommendations", error);
                }
            };

            fetchRecommendations();
        }
    }, [landId, plantId]);

    const handleAddSowing = async (e) => {
        e.preventDefault();

        if (!plantId || !sowingDate || !landId) {
            setSnackbarMessage('Please fill in all the fields.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        const newSowing = {
            plantId: parseInt(plantId),
            sowingDate: sowingDate,
            landId: parseInt(landId)
        };

        try {
            const response = await axios.post('http://localhost:8080/sowings', newSowing, { withCredentials: true });
            if (response.status === 200) {
                setSnackbarMessage('Sowing saved successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                setTimeout(() => navigate('/sowing-list'), 3000);
                setPlantId('');
                setSowingDate('');
                setLandId('');
            } else {
                setSnackbarMessage('Failed to save the Sowing.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage('Error: ' + error.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container maxWidth="lg">
            <BreadcrumbComponent pageName="Ekim Yap" />
            <Grid container spacing={4}>
                {/* Sol taraf: Form */}
                <Grid item xs={12} md={6}>
                    <Box component="form" onSubmit={handleAddSowing} sx={{ mt: 3 }}>
                        <Typography variant="h4" component="h2" gutterBottom>
                            Add Sowing
                        </Typography>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Kategori</InputLabel>
                            <Select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>{category.categoryName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Bitki</InputLabel>
                            <Select
                                value={plantId}
                                onChange={(e) => setPlantId(e.target.value)}
                                disabled={!selectedCategory}
                            >
                                {plants.map((plant) => (
                                    <MenuItem key={plant.id} value={plant.id}>{plant.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Sowing Date"
                            type="date"
                            variant="outlined"
                            margin="normal"
                            value={sowingDate}
                            onChange={(e) => setSowingDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Land</InputLabel>
                            <Select
                                value={landId}
                                onChange={(e) => setLandId(e.target.value)}
                            >
                                {lands.map((land) => (
                                    <MenuItem key={land.id} value={land.id}>{land.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button type="submit" variant="contained" fullWidth sx={{
                            mt: 2,
                            backgroundColor: green[700],
                        }}>
                            Add Sowing
                        </Button>
                    </Box>
                </Grid>

                {/* Sağ taraf: Öneri Alanı */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" component="h3" gutterBottom>
                        Recommendations
                    </Typography>
                    {recommendations.length > 0 ? (
                        recommendations.map((recommendation, index) => (
                            <Card key={index} sx={{ display: 'flex', mb: 2 }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 100 }}
                                    image={recommendation.image} // Önerilen ürün resmi
                                    alt={recommendation.name}
                                />
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <CardContent>
                                        <Typography component="h6" variant="h6">
                                            {recommendation.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Success Rate: {recommendation.successRate}%
                                        </Typography>
                                    </CardContent>
                                </Box>
                            </Card>
                        ))
                    ) : (
                        <Typography>No recommendations available.</Typography>
                    )}
                </Grid>
            </Grid>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default AddSowing;
