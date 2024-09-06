import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Snackbar,
    Alert,
    Paper, InputAdornment, TextField
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";

const Evaluation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [harvestId, setHarvestId] = useState(null);
    const [weatherCondition, setWeatherCondition] = useState('');
    const [productQuality, setProductQuality] = useState('');
    const [productQuantity, setProductQuantity] = useState(0);
    const [irrigation, setIrrigation] = useState(null);
    const [fertilisation, setFertilisation] = useState(null);
    const [spraying, setSpraying] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        if (location.state && location.state.harvestId) {
            setHarvestId(location.state.harvestId);
        } else {
            console.error('Harvest ID is missing');
            navigate('/sowings');
        }
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!harvestId) {
            console.error('Harvest ID is null');
            return;
        }

        const newEvaluation = {
            harvestId,
            weatherCondition,
            productQuality,
            productQuantity: parseFloat(productQuantity),
            irrigation: irrigation === true ? 1 : 0,
            fertilisation: fertilisation === true ? 1 : 0,
            spraying: spraying === true ? 1 : 0
        };

        try {
            const response = await axios.post('http://localhost:8080/evaluations', newEvaluation, { withCredentials: true });

            if (response.status === 200) {
                setSnackbarMessage('Değerlendirme başarıyla gerçekleştirilmiştir.');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setTimeout(() => navigate('/'), 3000);
            } else {
                setSnackbarMessage('Failed to save the evaluation.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Error occurred:', error);
            setSnackbarMessage('Error: ' + error.message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container maxWidth="xl">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Değerlendirme Formu
                </Typography>

                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ borderRight: '1px solid #ddd' }}></TableCell>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>Çok Kötü</TableCell>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>Kötü</TableCell>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>Orta</TableCell>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>İyi</TableCell>
                                <TableCell align="center">Çok İyi</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Hasat Koşulları */}
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ borderRight: '1px solid #ddd' }}>
                                    Hasat Koşulları
                                </TableCell>
                                {['Çok Kötü', 'Kötü', 'Orta', 'İyi', 'Çok İyi'].map((label) => (
                                    <TableCell align="center" key={label} sx={{ borderRight: '1px solid #ddd' }}>
                                        <Checkbox
                                            checked={weatherCondition === label}
                                            onChange={() => setWeatherCondition(label)}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>

                            {/* Ürün Kalitesi */}
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ borderRight: '1px solid #ddd' }}>
                                    Ürün Kalitesi
                                </TableCell>
                                {['Çok Kötü', 'Kötü', 'Orta', 'İyi', 'Çok İyi'].map((label) => (
                                    <TableCell align="center" key={label} sx={{ borderRight: '1px solid #ddd' }}>
                                        <Checkbox
                                            checked={productQuality === label}
                                            onChange={() => setProductQuality(label)}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>

                            {/* Ürün Miktarı */}
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ borderRight: '1px solid #ddd' }}>
                                    Ürün Miktarı
                                </TableCell>
                                <TableCell colSpan={5} align="center">
                                    <TextField
                                        label="Ürün Miktarı"
                                        value={productQuantity}
                                        onChange={(e) => setProductQuantity(e.target.value)}
                                        type="number"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                                        }}
                                        fullWidth
                                        variant="outlined"
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Sulama, Gübreleme, İlaçlama Değerlendirme Tablosu */}
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ borderRight: '1px solid #ddd' }}></TableCell>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>Yapılmadı</TableCell>
                                <TableCell align="center">Yapıldı</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Sulama */}
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ borderRight: '1px solid #ddd' }}>
                                    Sulama
                                </TableCell>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>
                                    <Checkbox
                                        checked={irrigation === false}
                                        onChange={() => setIrrigation(false)}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Checkbox
                                        checked={irrigation === true}
                                        onChange={() => setIrrigation(true)}
                                    />
                                </TableCell>
                            </TableRow>

                            {/* Gübreleme */}
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ borderRight: '1px solid #ddd' }}>
                                    Gübreleme
                                </TableCell>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>
                                    <Checkbox
                                        checked={fertilisation === false}
                                        onChange={() => setFertilisation(false)}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Checkbox
                                        checked={fertilisation === true}
                                        onChange={() => setFertilisation(true)}
                                    />
                                </TableCell>
                            </TableRow>

                            {/* İlaçlama */}
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ borderRight: '1px solid #ddd' }}>
                                    İlaçlama
                                </TableCell>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>
                                    <Checkbox
                                        checked={spraying === false}
                                        onChange={() => setSpraying(false)}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Checkbox
                                        checked={spraying === true}
                                        onChange={() => setSpraying(true)}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Gönder
                    </Button>
                </Box>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                >
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
};

export default Evaluation;
