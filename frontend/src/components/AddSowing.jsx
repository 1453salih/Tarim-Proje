import React, {useState, useEffect} from 'react';
import {
    TextField, Button, Container, Typography, Box, MenuItem,
    FormControl, InputLabel, Select, Snackbar, Alert, Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Input,InputAdornment
} from '@mui/material';

import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import BreadcrumbComponent from "./BreadCrumb";
import {green} from "@mui/material/colors";
import {createTheme, ThemeProvider} from '@mui/material/styles';
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
    const [snackbar, setSnackbar] = useState({open: false, message: '', severity: 'success'});
    const navigate = useNavigate();
    const [sowingField, setSowingField] = useState('');


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/categories', {withCredentials: true});
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
                    const response = await axios.get(`http://localhost:8080/plants/by-category?categoryId=${selectedCategory}`, {withCredentials: true});
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
                    axios.get('http://localhost:8080/plants', {withCredentials: true}),
                    axios.get('http://localhost:8080/lands', {withCredentials: true})
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
        const fetchRecommendations = async () => {
            try {
                // İlk olarak landId'yi kullanarak locality bilgisi alınıyor
                const localityResponse = await axios.get(`http://localhost:8080/lands/${landId}/locality`, {withCredentials: true});
                console.log("Locality Response:", localityResponse.data);
                const localityCode = localityResponse.data.code;


                if (!localityCode) {
                    console.error("Locality code is undefined");
                    return;
                }

                // locality_code ile recommendation verileri alınıyor
                const recommendationsResponse = await axios.get(`http://localhost:8080/recommendations?localityCode=${localityCode}`, {withCredentials: true});
                console.log("Recommendations: ", recommendationsResponse.data);
                setRecommendations(recommendationsResponse.data);
            } catch (error) {
                console.error("Error Fetching Recommendations", error);
            }
        };

        if (landId) {
            fetchRecommendations();
        }
    }, [landId]);

    const handleAddSowing = async (e) => {
        e.preventDefault();

        if (!plantId || !sowingDate || !landId || !sowingField) {
            setSnackbar({open: true, message: 'Please fill in all the fields.', severity: 'error'});
            return;
        }

        const newSowing = {
            plantId: parseInt(plantId),
            sowingDate: sowingDate,
            landId: parseInt(landId),
            sowingField: parseFloat(sowingField)
        };

        try {
            const response = await axios.post('http://localhost:8080/sowings', newSowing, {withCredentials: true});
            if (response.status === 200) {
                setSnackbar({open: true, message: 'Sowing saved successfully!', severity: 'success'});
                setTimeout(() => navigate('/sowing-list'), 3000);
                setPlantId('');
                setSowingDate('');
                setLandId('');
                setSowingField(''); // Alanı temizle
            } else {
                setSnackbar({open: true, message: 'Failed to save the Sowing.', severity: 'error'});
            }
        } catch (error) {
            setSnackbar({open: true, message: 'Error: ' + error.message, severity: 'error'});
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({...prev, open: false}));
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{fontFamily: 'Poppins, sans-serif'}}>
                <BreadcrumbComponent pageName="Ekim Yap"/>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Box component="form" onSubmit={handleAddSowing} sx={{mt: 3}}>
                            <Typography variant="h5" component="h3" gutterBottom>
                                Add Sowing
                            </Typography>

                            <FormControl fullWidth margin="normal">
                                <InputLabel>Kategori</InputLabel>
                                <Select
                                    label="Kategori"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.id}
                                                  value={category.id}>{category.categoryName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <InputLabel>Bitki</InputLabel>
                                <Select
                                    label="Bitki"
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
                                    label="Land"
                                    value={landId}
                                    onChange={(e) => setLandId(e.target.value)}
                                >
                                    {lands.map((land) => (
                                        <MenuItem key={land.id} value={land.id}>{land.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="outlined-basic"
                                    label="Planted Area Size"
                                    variant="outlined"
                                    type="number"
                                    value={sowingField}
                                    onChange={(e) => setSowingField(e.target.value)} // Plnat Area Size alanında yapılan değişiklikleri tutar böylece ne yazzdıysak alır.
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                                    }}
                                    inputProps={{ min: 0 }}
                                />
                            </FormControl>
                            <Button type="submit" variant="contained" fullWidth
                                    sx={{mt: 2, backgroundColor: green[700]}}>
                                Add Sowing
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" component="h3" gutterBottom sx={{mt: 3, mb: 3}}>
                            Recommendations
                        </Typography>
                        {recommendations.length > 0 ? (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Plant İmage</TableCell>
                                            <TableCell>Plant Name</TableCell>
                                            <TableCell>Success Rate</TableCell>
                                            <TableCell>Harvest Period</TableCell>
                                            <TableCell>Sowing Period</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {recommendations.map((recommendation, index) => (
                                            <TableRow key={index} sx={{fontFamily: 'Poppins, sans-serif'}}>
                                                <TableCell>
                                                    <img
                                                        src={recommendation.plantImage}
                                                        alt={recommendation.plantName}
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            objectFit: 'cover',
                                                            borderRadius: '10px'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{recommendation.plantName}</TableCell>
                                                <TableCell>{recommendation.succesRate}%</TableCell>
                                                <TableCell>{recommendation.harvestPeriod}</TableCell>
                                                <TableCell>{recommendation.sowingPeriod}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography>No recommendations available.</Typography>
                        )}
                    </Grid>
                </Grid>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{width: '100%'}}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
}

export default AddSowing;
