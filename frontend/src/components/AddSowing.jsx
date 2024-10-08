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

    const [plantIdError, setPlantIdError] = useState(false);
    const [sowingDateError, setSowingDateError] = useState(false);
    const [landIdError, setLandIdError] = useState(false);
    const [sowingFieldError, setSowingFieldError] = useState(false);
    const [availableLand, setAvailableLand] = useState(null);  //* Ekilebilir Alan




    useEffect(() => {
        if (landId) {
            const fetchAvailableLand = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/lands/detail/${landId}`, { withCredentials: true });
                    console.log("Ekilebilir Alan:", response.data.clayableLand);//kontrol
                    setAvailableLand(response.data.clayableLand); // Ekilebilir alanı ayarlıyoruz.
                } catch (error) {
                    console.error('Mevcut araziyi alırken hata oluştu.:', error);
                }
            };
            fetchAvailableLand();
        }
    }, [landId]);


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
                    console.error("Bitkiler Alınamadı.", error);
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
                setLands(landsResponse.data.content || []);  // Sayfalandırılmış yanıttan content dizisini çıkarır.
            } catch (error) {
                console.error('Bitkiler ve araziler getirilirken hata oluştu:', error);
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
        } else if (availableLand === null) {
            setSnackbar({ open: true, message: `Ekim alanı için geçerli bir arazi seçilmelidir.`, severity: 'error' });
            hasError = true;
        } else if (parseFloat(sowingField) > availableLand) {
            setSowingFieldError(true);
            setSnackbar({ open: true, message: `Ekim alanı ${availableLand} m²'yi aşmamalıdır.`, severity: 'error' });
            hasError = true;
        } else {
            setSowingFieldError(false);
        }



        if (hasError) {
            return;
        }

        const newSowing = {
            plantId: parseInt(plantId),
            sowingDate: sowingDate,
            landId: parseInt(landId),
            sowingField: parseFloat(sowingField),
        };

        try {
            const response = await axios.post('http://localhost:8080/sowings', newSowing, { withCredentials: true });
            if (response.status === 200 || response.status === 201) {
                setSnackbar({ open: true, message: 'Ekim işlemi başarıyla kaydedildi!', severity: 'success' });
                setPlantId('');
                setSowingDate('');
                setLandId('');
                setSowingField('');
                setTimeout(() => navigate('/sowing-list'), 3000);
            } else {
                setSnackbar({ open: true, message: 'Ekim kaydedilemedi.', severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Error: ' + error.message, severity: 'error' });
        }
    };


    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleCancel = () => {
        navigate('/home');  // İptal işlemi.
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg">
                <BreadcrumbComponent pageName="Ekim Yap" />
                <Grid container spacing={4} sx={{ mt: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Paper component="form" onSubmit={handleAddSowing} sx={{ p: 5 }} elevation={6}>
                            <Typography variant="h5" component="h3" gutterBottom>
                                Ekim Yap
                            </Typography>
                            <FormControl fullWidth margin="normal" error={landIdError}>
                                <InputLabel>Arazi</InputLabel>
                                <Select
                                    label="Arazi"
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
                                label="Ekim Tarihi"
                                type="date"
                                variant="outlined"
                                margin="normal"
                                value={sowingDate}
                                onChange={(e) => setSowingDate(e.target.value)}
                                error={sowingDateError}
                                helperText={sowingDateError ? 'Lütfen bir tarih seçiniz.' : ''}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />



                            <TextField
                                fullWidth
                                label="Ekilmiş Alan"
                                variant="outlined"
                                type="number"
                                value={sowingField}
                                onChange={(e) => setSowingField(e.target.value)}
                                error={sowingFieldError}
                                helperText={sowingFieldError ? 'Lütfen geçerli bir değer girin.' : ''}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                                }}
                                inputProps={{ min: 0 }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{
                                    mt: 2,
                                    mb:1,
                                    backgroundColor: orange[700],
                                    '&:hover': {
                                        backgroundColor: orange[900],
                                    },
                                }}
                            >
                                Ekim Yap
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                color='error'
                                onClick={handleCancel}
                            >
                                İptal
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