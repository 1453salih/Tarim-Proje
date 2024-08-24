import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Snackbar,
    Alert,
    Paper
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BreadcrumbComponent from "./BreadCrumb.jsx";
import ImageUploader from "./ImageUploader.jsx";

function AddLand() {
    const [landName, setLandName] = useState('');
    const [landSize, setLandSize] = useState('');
    const [selectedIl, setSelectedIl] = useState('');
    const [selectedIlce, setSelectedIlce] = useState('');
    const [selectedKoy, setSelectedKoy] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);

    const navigate = useNavigate();

    const [landNameError, setLandNameError] = useState(false);
    const [landSizeError, setLandSizeError] = useState(false);
    const [selectedIlError, setSelectedIlError] = useState(false);
    const [selectedIlceError, setSelectedIlceError] = useState(false);
    const [selectedKoyError, setSelectedKoyError] = useState(false);

    useEffect(() => {
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

        let hasError = false;

        if (!landName) setLandNameError(true), hasError = true;
        else setLandNameError(false);

        if (!landSize) setLandSizeError(true), hasError = true;
        else setLandSizeError(false);

        if (!selectedIl) setSelectedIlError(true), hasError = true;
        else setSelectedIlError(false);

        if (!selectedIlce) setSelectedIlceError(true), hasError = true;
        else setSelectedIlceError(false);

        if (!selectedKoy) setSelectedKoyError(true), hasError = true;
        else setSelectedKoyError(false);

        if (hasError) {
            setSnackbarMessage('Lütfen tüm alanları doldurun.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        const userId = localStorage.getItem('userId');
        if (!userId) {
            setSnackbarMessage('Kullanıcı oturumu açık değil.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        const landData = {
            name: landName,
            landSize: parseInt(landSize),
            localityId: selectedKoy,
            userId: parseInt(userId),
        };

        const formData = new FormData();
        formData.append('land', new Blob([JSON.stringify(landData)], { type: "application/json" }));
        formData.append('file', imageUrl);

        try {
            const response = await axios.post('http://localhost:8080/lands', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (response.status === 201) {
                setSnackbarMessage('Arazi başarıyla kaydedildi!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                setTimeout(() => navigate('/land-list'), 3000);
                setLandName('');
                setLandSize('');
                setSelectedIl('');
                setSelectedIlce('');
                setSelectedKoy('');
                setImageUrl('');
            } else {
                setSnackbarMessage('Arazi kaydedilemedi.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage('Hata: ' + error.message);
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
                <BreadcrumbComponent pageName="Arazi Ekle"/>
            </Box>
            <Paper component="form" onSubmit={handleAddLand} sx={{mt: 3, p: 3}}>
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

                <FormControl fullWidth margin="normal" error={selectedKoyError}
                             disabled={!selectedIlce || villages.length === 0}>
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

                <ImageUploader onImageUpload={setImageUrl} />

                <Button type="submit" variant="contained" fullWidth sx={{
                    mt: 2, backgroundColor: "#ff8a00",
                    '&:hover': {
                        backgroundColor: '#ff7a00',
                    }
                }}>
                    Add Land
                </Button>
            </Paper>

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
