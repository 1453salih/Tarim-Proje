import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, MenuItem, FormControl, InputLabel, Select, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BreadcrumbComponent from "./BreadCrumb.jsx";

function AddLand() {
    const [landName, setLandName] = useState('');
    const [landSize, setLandSize] = useState('');
    const [selectedIl, setSelectedIl] = useState('');
    const [selectedIlce, setSelectedIlce] = useState('');
    const [selectedKoy, setSelectedKoy] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [cities, setCities] = useState([]); // Şehir listesi
    const [districts, setDistricts] = useState([]); // İlçe listesi
    const [villages, setVillages] = useState([]); // Köy/Mahalle listesi

    const navigate = useNavigate();

    //*Error State
    const [landNameError, setLandNameError] = useState(false);
    const [landSizeError, setLandSizeError] = useState(false);
    const [selectedIlError, setSelectedIlError] = useState(false);
    const [selectedIlceError, setSelectedIlceError] = useState(false);
    const [selectedKoyError, setSelectedKoyError] = useState(false);
    //*----------------------------------------------------------------------------------
    useEffect(() => {
        // Şehirleri veritabanından çekmek için API isteği
        const fetchCities = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/locations/cities');
                setCities(response.data);
            } catch (error) {
                console.error("Error fetching cities:", error);
            }
        };

        fetchCities();
    }, []);

    useEffect(() => {
        if (selectedIl) {
            const fetchDistricts = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/locations/districts/${selectedIl}`);
                    setDistricts(response.data);
                    setSelectedIlce('');
                    setVillages([]);
                    setSelectedKoy('');
                } catch (error) {
                    console.error("Error fetching districts:", error);
                }
            };

            fetchDistricts();
        }
    }, [selectedIl]);

    useEffect(() => {
        if (selectedIlce) {
            const fetchLocalities = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/locations/localities/${selectedIlce}`);
                    setVillages(response.data);
                    setSelectedKoy('');
                } catch (error) {
                    console.error("Error fetching localities:", error);
                }
            };

            fetchLocalities();
        } else {
            setVillages([]);
        }
    }, [selectedIlce]);

    const handleAddLand = async (e) => {
        e.preventDefault();

        // Boş alan kontrolü
        let hasError = false;

        if (!landName) {
            setLandNameError(true);
            hasError = true;
        } else {
            setLandNameError(false);
        }

        if (!landSize) {
            setLandSizeError(true);
            hasError = true;
        } else {
            setLandSizeError(false);
        }

        if (!selectedIl) {
            setSelectedIlError(true);
            hasError = true;
        } else {
            setSelectedIlError(false);
        }

        if (!selectedIlce) {
            setSelectedIlceError(true);
            hasError = true;
        } else {
            setSelectedIlceError(false);
        }

        if (!selectedKoy) {
            setSelectedKoyError(true);
            hasError = true;
        } else {
            setSelectedKoyError(false);
        }

        if (hasError) {
            setSnackbarMessage('Please fill in all the fields.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        const userId = localStorage.getItem('userId');
        if (!userId) {
            setSnackbarMessage('User not logged in.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        const newLand = {
            name: landName,
            landSize: parseInt(landSize),
            localityId: selectedKoy, // localityId yeterli diye düşünüyorum.
            userId: parseInt(userId)
        };

        try {
            const response = await axios.post('http://localhost:8080/lands', newLand, { withCredentials: true });
            if (response.status === 200) {
                setSnackbarMessage('Land saved successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                setTimeout(() => navigate('/land-list'), 3000);
                setLandName('');
                setLandSize('');
                setSelectedIl('');
                setSelectedIlce('');
                setSelectedKoy('');
            } else {
                setSnackbarMessage('Failed to save the Land.');
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
        <Container maxWidth="sm">
            <Box>
                <BreadcrumbComponent pageName="Arazi Ekle" />
            </Box>
            <Box component="form" onSubmit={handleAddLand} sx={{ mt: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Add Land
                </Typography>
                <TextField
                    fullWidth
                    label="Land Name"
                    variant="outlined"
                    margin="normal"
                    value={landName}
                    onChange={(e) => {
                        setLandName(e.target.value);
                        if (e.target.value) setLandNameError(false);
                    }}
                    error={landNameError}
                    helperText={landNameError ? "Land name is required." : ""}
                />

                <TextField
                    fullWidth
                    label="Land Size (hectares)"
                    variant="outlined"
                    margin="normal"
                    value={landSize}
                    onChange={(e) => {
                        setLandSize(e.target.value);
                        if (e.target.value) setLandSizeError(false);
                    }}
                    error={landSizeError}
                    helperText={landSizeError ? "Land size is required." : ""}
                />

                <FormControl fullWidth margin="normal" error={selectedIlError}>
                    <InputLabel>İl</InputLabel>
                    <Select
                        value={selectedIl}
                        onChange={(e) => {
                            setSelectedIl(e.target.value);
                            if (e.target.value) setSelectedIlError(false);
                        }}
                    >
                        {cities.map(city => (
                            <MenuItem key={city.code} value={city.code}>{city.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" error={selectedIlceError} disabled={!selectedIl}>
                    <InputLabel>İlçe</InputLabel>
                    <Select
                        value={selectedIlce}
                        onChange={(e) => {
                            setSelectedIlce(e.target.value);
                            if (e.target.value) setSelectedIlceError(false);
                        }}
                    >
                        {districts.map(district => (
                            <MenuItem key={district.code} value={district.code}>{district.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" error={selectedKoyError} disabled={!selectedIlce || villages.length === 0}>
                    <InputLabel>Köy/Mahalle</InputLabel>
                    <Select
                        value={selectedKoy}
                        onChange={(e) => {
                            setSelectedKoy(e.target.value);
                            if (e.target.value) setSelectedKoyError(false);
                        }}
                    >
                        {villages.map(locality => (
                            <MenuItem key={locality.code} value={locality.code}>{locality.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>


                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Add Land
                </Button>
            </Box>

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

export default AddLand;
