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
    Paper,
    InputAdornment,
    TextField,
    Divider
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

const EvaluationEdit = () => {
    const { id } = useParams();
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
        const fetchEvaluation = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/evaluations/api/${id}`, { withCredentials: true });
                const data = response.data;
                setHarvestId(data.harvestId);
                setWeatherCondition(data.weatherCondition);
                setProductQuality(data.productQuality);
                setProductQuantity(data.productQuantity);
                setIrrigation(data.irrigation === 1);
                setFertilisation(data.fertilisation === 1);
                setSpraying(data.spraying === 1);
            } catch (error) {
                console.error('Veriler alınırken hata oluştu:', error);
            }
        };
        fetchEvaluation();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!harvestId) {
            console.error('Hasat ID null');
            return;
        }

        const updatedEvaluation = {
            harvestId,
            weatherCondition,
            productQuality,
            productQuantity: parseFloat(productQuantity),
            irrigation: irrigation ? 1 : 0,
            fertilisation: fertilisation ? 1 : 0,
            spraying: spraying ? 1 : 0
        };

        try {
            const response = await axios.put(`http://localhost:8080/evaluations/${id}`, updatedEvaluation, { withCredentials: true });

            if (response.status === 200) {
                setSnackbarMessage('Değerlendirme başarıyla güncellendi.');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setTimeout(() => navigate('/evaluation-list'), 3000);
            } else {
                setSnackbarMessage('Değerlendirme kaydedilemedi.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Hata oluştu:', error);
            setSnackbarMessage('Hata: ' + error.message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container maxWidth="lg" sx={{ backgroundColor: 'none', borderRadius: 2, boxShadow: 3, p: 3 ,mt:5}}>
            <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                    Değerlendirme Güncelleme Formu
                </Typography>
                <Typography variant="body1" sx={{ color: '#757575', mt: 2, textAlign: 'left' }}>
                    Değerlendirme bilgileri doldururken objektif olmanız, hem size hem de tarıma katkı sağlayacaktır.
                    Gerçekçi ve tarafsız bir değerlendirme, verilerin doğruluğunu artıracak ve tarım süreçlerinde
                    daha sağlıklı sonuçlar elde edilmesine yardımcı olacaktır.
                </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <TableContainer component={Paper} sx={{ mt: 4, boxShadow: 1, borderRadius: 2, overflow: 'hidden' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ borderRight: '1px solid #ddd', backgroundColor: '#f5f5f5', width: '25%' }}></TableCell>
                            <TableCell align="center" sx={{ borderRight: '1px solid #ddd', fontWeight: 'bold', color: '#3f51b5', width: '15%' }}>Çok Kötü</TableCell>
                            <TableCell align="center" sx={{ borderRight: '1px solid #ddd', fontWeight: 'bold', color: '#3f51b5', width: '15%' }}>Kötü</TableCell>
                            <TableCell align="center" sx={{ borderRight: '1px solid #ddd', fontWeight: 'bold', color: '#3f51b5', width: '15%' }}>Orta</TableCell>
                            <TableCell align="center" sx={{ borderRight: '1px solid #ddd', fontWeight: 'bold', color: '#3f51b5', width: '15%' }}>İyi</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', color: '#3f51b5', width: '15%' }}>Çok İyi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Hasat Koşulları */}
                        <TableRow>
                            <TableCell component="th" scope="row" sx={{ borderRight: '1px solid #ddd', backgroundColor: '#e3f2fd', fontWeight: 'bold', width: '25%' }}>
                                Hasat Koşulları
                            </TableCell>
                            {['Çok Kötü', 'Kötü', 'Orta', 'İyi', 'Çok İyi'].map((label) => (
                                <TableCell align="center" key={label} sx={{ borderRight: '1px solid #ddd' }}>
                                    <Checkbox
                                        checked={weatherCondition === label}
                                        onChange={() => setWeatherCondition(label)}
                                        sx={{ color: '#3f51b5' }}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* Ürün Kalitesi */}
                        <TableRow>
                            <TableCell component="th" scope="row" sx={{ borderRight: '1px solid #ddd', backgroundColor: '#e3f2fd', fontWeight: 'bold', width: '25%' }}>
                                Ürün Kalitesi
                            </TableCell>
                            {['Çok Kötü', 'Kötü', 'Orta', 'İyi', 'Çok İyi'].map((label) => (
                                <TableCell align="center" key={label} sx={{ borderRight: '1px solid #ddd' }}>
                                    <Checkbox
                                        checked={productQuality === label}
                                        onChange={() => setProductQuality(label)}
                                        sx={{ color: '#3f51b5' }}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* Ürün Miktarı */}
                        <TableRow>
                            <TableCell component="th" scope="row" sx={{ borderRight: '1px solid #ddd', backgroundColor: '#e3f2fd', fontWeight: 'bold', width: '25%' }}>
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
                                    sx={{ maxWidth: '300px' }}
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Divider sx={{ mt: 4, mb: 3 }} />

            {/* Sulama, Gübreleme, İlaçlama Değerlendirme Tablosu */}
            <TableContainer component={Paper} sx={{ mt: 4, boxShadow: 1, borderRadius: 2, overflow: 'hidden' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ borderRight: '1px solid #ddd', backgroundColor: '#f5f5f5', width: '25%' }}></TableCell>
                            <TableCell align="center" sx={{ borderRight: '1px solid #ddd', fontWeight: 'bold', color: '#3f51b5', width: '45%' }}>Yapılmadı</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', color: '#3f51b5', width: '45%' }}>Yapıldı</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Sulama */}
                        <TableRow>
                            <TableCell component="th" scope="row" sx={{ borderRight: '1px solid #ddd', backgroundColor: '#e3f2fd', fontWeight: 'bold', width: '25%' }}>
                                Sulama
                            </TableCell>
                            <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>
                                <Checkbox
                                    checked={irrigation === false}
                                    onChange={() => setIrrigation(false)}
                                    sx={{ color: '#3f51b5' }}
                                />
                            </TableCell>
                            <TableCell align="center">
                                <Checkbox
                                    checked={irrigation === true}
                                    onChange={() => setIrrigation(true)}
                                    sx={{ color: '#3f51b5' }}
                                />
                            </TableCell>
                        </TableRow>

                        {/* Gübreleme */}
                        <TableRow>
                            <TableCell component="th" scope="row" sx={{ borderRight: '1px solid #ddd', backgroundColor: '#e3f2fd', fontWeight: 'bold', width: '25%' }}>
                                Gübreleme
                            </TableCell>
                            <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>
                                <Checkbox
                                    checked={fertilisation === false}
                                    onChange={() => setFertilisation(false)}
                                    sx={{ color: '#3f51b5' }}
                                />
                            </TableCell>
                            <TableCell align="center">
                                <Checkbox
                                    checked={fertilisation === true}
                                    onChange={() => setFertilisation(true)}
                                    sx={{ color: '#3f51b5' }}
                                />
                            </TableCell>
                        </TableRow>

                        {/* İlaçlama */}
                        <TableRow>
                            <TableCell component="th" scope="row" sx={{ borderRight: '1px solid #ddd', backgroundColor: '#e3f2fd', fontWeight: 'bold', width: '25%' }}>
                                İlaçlama
                            </TableCell>
                            <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>
                                <Checkbox
                                    checked={spraying === false}
                                    onChange={() => setSpraying(false)}
                                    sx={{ color: '#3f51b5' }}
                                />
                            </TableCell>
                            <TableCell align="center">
                                <Checkbox
                                    checked={spraying === true}
                                    onChange={() => setSpraying(true)}
                                    sx={{ color: '#3f51b5' }}
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mt: 6, textAlign: 'center' }}>
                <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ fontWeight: 'bold', px: 5, py: 2, borderRadius: 3 }}>
                    Güncelle
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
        </Container>
    );
};

export default EvaluationEdit;
