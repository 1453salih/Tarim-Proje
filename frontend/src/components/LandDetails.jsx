import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Button, TextField, MenuItem, FormControl, InputLabel, Select, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ImageUploader from "./ImageUploader.jsx";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";

const LandDetails = () => {
    const { id } = useParams();
    const [land, setLand] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedIl, setSelectedIl] = useState('');
    const [selectedIlce, setSelectedIlce] = useState('');
    const [selectedKoy, setSelectedKoy] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);
    const navigate = useNavigate();

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    //* Hem Json verisi hem de dosya gönderilebilmesini sağlar.



    const handleSave = () => {
        const updatedLand = {
            ...land,
            localityId: selectedKoy, // Güncellenmiş localityId'yi kullanıyoruz
        };

        const formData = new FormData();
        formData.append('land', new Blob([JSON.stringify(updatedLand)], { type: 'application/json' }));
        if (imageUrl) {
            formData.append('file', imageUrl);
        }

        fetch(`http://localhost:8080/lands/update/${id}`, {
            method: 'PUT',
            body:formData,
        })
            .then(response => response.json())
            .then(data => {
                // Veriyi kaydettikten sonra tekrar yükleyin
                fetch(`http://localhost:8080/lands/detail/${id}`)
                    .then(response => response.json())
                    .then(updatedData => {
                        setLand(updatedData);
                        setIsEditing(false);
                        setSnackbarMessage('Land updated successfully!');
                        setSnackbarSeverity('success');
                        setOpenSnackbar(true);
                    });
            })
            .catch(error => {
                console.error('Error updating land details:', error);
                setSnackbarMessage('Failed to update the Land.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            });
    };




    const handleDelete = () => {
        fetch(`http://localhost:8080/lands/delete/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    setSnackbarMessage('Land deleted successfully!');
                    setSnackbarSeverity('success');
                    setOpenSnackbar(true);
                    setOpenDeleteDialog(false);
                    navigate('/lands');
                } else {
                    setSnackbarMessage('Failed to delete the Land.');
                    setSnackbarSeverity('error');
                    setOpenSnackbar(true);
                }
            })
            .catch(error => {
                console.error('Error deleting land:', error);
                setSnackbarMessage('Failed to delete the Land.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            });
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    // Şehir, ilçe ve köy bilgilerini API üzerinden almak için useEffect hookları
    useEffect(() => {
        axios.get('http://localhost:8080/api/locations/cities')
            .then(response => setCities(response.data))
            .catch(error => console.error("Error fetching cities:", error));
    }, []);

    useEffect(() => {
        if (selectedIl) {
            axios.get(`http://localhost:8080/api/locations/districts/${selectedIl}`)
                .then(response => {
                    setDistricts(response.data);
                })
                .catch(error => console.error("Error fetching districts:", error));
        }
    }, [selectedIl]);

    useEffect(() => {
        if (selectedIlce) {
            axios.get(`http://localhost:8080/api/locations/localities/${selectedIlce}`)
                .then(response => {
                    setVillages(response.data);
                })
                .catch(error => console.error("Error fetching localities:", error));
        }
    }, [selectedIlce]);



    useEffect(() => {
        fetch(`http://localhost:8080/lands/detail/${id}`)
            .then(response => response.json())
            .then(data => {
                setLand(data);
                setSelectedIl(data.location?.cityCode || ''); // cityName yerine cityCode
                setSelectedIlce(data.location?.districtCode || ''); // districtName yerine districtCode
                setSelectedKoy(data.location?.localityCode || ''); // localityName yerine localityCode

                // İl ve ilçe bilgilerini set ettikten sonra, ilçe ve köy verilerini de çekmek için ilgili API'leri çağırıyoruz.
                if (data.location?.cityCode) {
                    axios.get(`http://localhost:8080/api/locations/districts/${data.location.cityCode}`)
                        .then(response => {
                            setDistricts(response.data);
                        });
                }

                if (data.location?.districtCode) {
                    axios.get(`http://localhost:8080/api/locations/localities/${data.location.districtCode}`)
                        .then(response => {
                            setVillages(response.data);
                        });
                }
            })
            .catch(error => console.error('Error fetching land details:', error));
    }, [id]);

    if (!land) {
        return <Typography>Loading...</Typography>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLand(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    {isEditing ? 'Arazi Bilgilerini Düzenle' : `${land.name} Detayları`}
                </Typography>
                <Paper elevation={3} sx={{ p: 2 }}>
                    {isEditing ? (
                        <>
                            <TextField
                                fullWidth
                                label="Arazi Adı"
                                name="name"
                                value={land.name}
                                onChange={handleChange}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Boyut (Hektar)"
                                name="landSize"
                                value={land.landSize}
                                onChange={handleChange}
                                margin="normal"
                            />

                            <FormControl fullWidth margin="normal">
                                <InputLabel>İl</InputLabel>
                                <Select
                                    name="city"
                                    value={selectedIl}
                                    onChange={(e) => {
                                        setSelectedIl(e.target.value);
                                        setSelectedIlce(''); // İl değiştiğinde ilçe sıfırlanır
                                        setSelectedKoy(''); // İlçe değiştiğinde köy/madde sıfırlanır
                                    }}
                                >
                                    {cities.map(city => (
                                        <MenuItem key={city.code} value={city.code}>{city.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal" disabled={!selectedIl}>
                                <InputLabel>İlçe</InputLabel>
                                <Select
                                    name="district"
                                    value={selectedIlce}
                                    onChange={(e) => {
                                        setSelectedIlce(e.target.value);
                                        setSelectedKoy(''); // İlçe değiştiğinde köy/madde sıfırlanır
                                    }}
                                >
                                    {districts.map(district => (
                                        <MenuItem key={district.code} value={district.code}>{district.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal" disabled={!selectedIlce || villages.length === 0}>
                                <InputLabel>Köy/Mahalle</InputLabel>
                                <Select
                                    name="village"
                                    value={selectedKoy}
                                    onChange={(e) => setSelectedKoy(e.target.value)}
                                >
                                    {villages.map(locality => (
                                        <MenuItem key={locality.code} value={locality.code}>{locality.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <ImageUploader onImageUpload={setImageUrl} />
                        </>
                    ) : (
                        <>
                            <Card sx={{ maxWidth: 345, boxShadow: 3 }}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={land.imageUrl|| "../../src/assets/DefaultImage/defaultLand.png"}
                                    alt="arazi görseli"
                                />
                            </Card>
                            <Typography variant="h6">Boyut: {land.landSize} hektar</Typography>
                            <Typography variant="h6">Şehir: {land.location?.cityName || 'N/A'}</Typography>
                            <Typography variant="h6">İlçe: {land.location?.districtName || 'N/A'}</Typography>
                            <Typography variant="h6">Köy: {land.location?.localityName || 'N/A'}</Typography>
                        </>
                    )}
                </Paper>
                <Box sx={{ marginTop: 3 }}>
                    {isEditing ? (
                        <>
                            <Button variant="contained" color="primary" onClick={handleSave}>
                                Kaydet
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handleEditToggle} sx={{ marginLeft: 2 }}>
                                İptal
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="contained" color="primary" onClick={handleEditToggle}>
                                Düzenle
                            </Button>
                            <Button variant="contained" color="error" onClick={handleOpenDeleteDialog} sx={{ marginLeft: 2 }}>
                                Sil
                            </Button>
                        </>
                    )}
                </Box>
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">Silmek istediğinizden emin misiniz?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Bu işlem geri alınamaz. Silmek istediğinizden emin misiniz?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        İptal
                    </Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        Sil
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default LandDetails;
