import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Container, Typography, Box, MenuItem,
    FormControl, InputLabel, Select, Snackbar, Alert, Grid,
    Paper, InputAdornment
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BreadcrumbComponent from "./BreadCrumb";
import RecommendationsTable from "./RecommendationsTable";
import { orange } from "@mui/material/colors";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '@fontsource/poppins';

const theme = createTheme({
    typography: {
        fontFamily: 'Poppins, sans-serif',
    },
});

function AddSowing() {
    const [plantId, setPlantId] = useState('');
    const [sowingDate, setSowingDate] = useState('');
    const [landId, setLandId] = useState('');
    const [plants, setPlants] = useState([]);
    const [lands, setLands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const navigate = useNavigate();
    const [sowingField, setSowingField] = useState('');
    const [sowingType, setSowingType] = useState('');
    const [plantIdError, setPlantIdError] = useState(false);
    const [sowingDateError, setSowingDateError] = useState(false);
    const [landIdError, setLandIdError] = useState(false);
    const [sowingFieldError, setSowingFieldError] = useState(false);
    const [sowingTypeError, setSowingTypeError] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/categories', { withCredentials: true });
                setCategories(response.data);
            } catch (error) {
                console.error("Error Fetching Categories", error);
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
                    console.error("Error Fetching Plants", error);
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

    const handleAddSowing = async (e) => {
        e.preventDefault();
        let hasError = false;

        if (!plantId) {
            setPlantIdError(true);
            hasError = true;
        } else {
            setPlantIdError(false);
        }

        if (!sowingDate) {
            setSowingDateError(true);
            hasError = true;
        } else {
            setSowingDateError(false);
        }

        if (!landId) {
            setLandIdError(true);
            hasError = true;
        } else {
            setLandIdError(false);
        }

        if (!sowingField) {
            setSowingFieldError(true);
            hasError = true;
        } else {
            setSowingFieldError(false);
        }

        if (!sowingType) {
            setSowingTypeError(true);
            hasError = true;
        } else {
            setSowingTypeError(false);
        }

        if (hasError) {
            setSnackbar({ open: true, message: 'Please fill in all the fields.', severity: 'error' });
            return;
        }

        const newSowing = {
            plantId: parseInt(plantId),
            sowingDate: sowingDate,
            landId: parseInt(landId),
            sowingField: parseFloat(sowingField),
            sowingType: sowingType
        };

        try {
            const response = await axios.post('http://localhost:8080/sowings', newSowing, { withCredentials: true });
            if (response.status === 200 || response.status === 201) {
                setSnackbar({ open: true, message: 'Sowing saved successfully!', severity: 'success' });
                setPlantId('');
                setSowingDate('');
                setLandId('');
                setSowingField('');
                setSowingType('');
                setTimeout(() => navigate('/sowing-list'), 3000);
            } else {
                setSnackbar({ open: true, message: 'Failed to save the Sowing.', severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Error: ' + error.message, severity: 'error' });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                <BreadcrumbComponent pageName="Ekim Yap" />
                <Grid container spacing={4} sx={{ mt: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Paper component="form" onSubmit={handleAddSowing} sx={{ p: 5 }} elevation={6}>
                            <Typography variant="h5" component="h3" gutterBottom>
                                Add Sowing
                            </Typography>

                            <FormControl fullWidth margin="normal" error={plantIdError}>
                                <InputLabel>Kategori</InputLabel>
                                <Select
                                    label="Kategori"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.categoryName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="normal" error={plantIdError}>
                                <InputLabel>Bitki</InputLabel>
                                <Select
                                    label="Bitki"
                                    value={plantId}
                                    onChange={(e) => setPlantId(e.target.value)}
                                    disabled={!selectedCategory}
                                >
                                    {plants.map((plant) => (
                                        <MenuItem key={plant.id} value={plant.id}>
                                            {plant.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {plantIdError && <Typography color="error">Please select a plant.</Typography>}
                            </FormControl>

                            <TextField
                                fullWidth
                                label="Sowing Date"
                                type="date"
                                variant="outlined"
                                margin="normal"
                                value={sowingDate}
                                onChange={(e) => setSowingDate(e.target.value)}
                                error={sowingDateError}
                                helperText={sowingDateError ? 'Please select a date.' : ''}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                            <FormControl fullWidth margin="normal" error={landIdError}>
                                <InputLabel>Land</InputLabel>
                                <Select
                                    label="Land"
                                    value={landId}
                                    onChange={(e) => setLandId(e.target.value)}
                                >
                                    {lands.map((land) => (
                                        <MenuItem key={land.id} value={land.id}>
                                            {land.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {landIdError && <Typography color="error">Please select a land.</Typography>}
                            </FormControl>

                            <TextField
                                fullWidth
                                label="Planted Area Size"
                                variant="outlined"
                                type="number"
                                value={sowingField}
                                onChange={(e) => setSowingField(e.target.value)}
                                error={sowingFieldError}
                                helperText={sowingFieldError ? 'Please enter a valid size.' : ''}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                                }}
                                inputProps={{ min: 0 }}
                            />

                            <FormControl fullWidth margin="normal" error={sowingTypeError}>
                                <InputLabel>Land Type</InputLabel>
                                <Select
                                    label="Land Type"
                                    value={sowingType}
                                    onChange={(e) => {
                                        setSowingType(e.target.value);
                                    }}
                                >
                                    <MenuItem value="Tarla" key="Tarla">Tarla</MenuItem>
                                    <MenuItem value="Bağ" key="Bağ">Bağ</MenuItem>
                                    <MenuItem value="Bahçe" key="Bahçe">Bahçe</MenuItem>
                                    <MenuItem value="Zeytinlik" key="Zeytinlik">Zeytinlik</MenuItem>
                                    <MenuItem value="Çayır" key="Çayır">Çayır</MenuItem>
                                    <MenuItem value="Mera" key="Mera">Mera</MenuItem>
                                </Select>
                                {sowingTypeError && <Typography color="error">Please select a land type.</Typography>}
                            </FormControl>

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{
                                    mt: 2,
                                    backgroundColor: orange[700],
                                    '&:hover': {
                                        backgroundColor: orange[900],
                                    },
                                }}
                            >
                                Add Sowing
                            </Button>
                        </Paper>
                    </Grid>
                    <RecommendationsTable landId={landId} />
                </Grid>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
}

export default AddSowing;
