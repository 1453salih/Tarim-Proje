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
    Rating,
    Paper, InputLabel, Select, MenuItem, FormControl, InputAdornment, TextField
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";

const Evaluation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [harvestId, setHarvestId] = useState(null);
    const [harvestCondition, setHarvestCondition] = useState('');
    const [productQuality, setProductQuality] = useState('');
    const [overallRating, setOverallRating] = useState(0);
    const [productQuantity, setProductQuantity] = useState(0);
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

    const handleCheckboxChange = (setter, value) => () => {
        setter(value);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!harvestId) {
            console.error('Harvest ID is null');
            return;
        }

        const newEvaloution = {
            harvestId,
            harvestCondition,
            productQuality,
            productQuantity: parseFloat(productQuantity),
            overallRating: parseFloat(overallRating)
        };

        try {
            const response = await axios.post('http://localhost:8080/evaloutions', newEvaloution, { withCredentials: true });

            if(response.status === 200){
                setSnackbarMessage('Evaluation was carried out successfully.');
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
            <Box sx={{mt:4}}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Değerlendirme Formu
                </Typography>

                <TableContainer component={Paper} sx={{mt: 4}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{borderRight: '1px solid #ddd'}}></TableCell>
                                <TableCell align="center" sx={{borderRight: '1px solid #ddd'}}>Çok Kötü</TableCell>
                                <TableCell align="center" sx={{borderRight: '1px solid #ddd'}}>Kötü</TableCell>
                                <TableCell align="center" sx={{borderRight: '1px solid #ddd'}}>Orta</TableCell>
                                <TableCell align="center" sx={{borderRight: '1px solid #ddd'}}>İyi</TableCell>
                                <TableCell align="center">Çok İyi</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{borderRight: '1px solid #ddd'}}>
                                    Hasat Koşulları
                                </TableCell>
                                {['Çok Kötü', 'Kötü', 'Orta', 'İyi', 'Çok İyi'].map((label) => (
                                    <TableCell align="center" key={label} sx={{borderRight: '1px solid #ddd'}}>
                                        <Checkbox
                                            checked={harvestCondition === label}
                                            onChange={handleCheckboxChange(setHarvestCondition, label)}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{borderRight: '1px solid #ddd'}}>
                                    Ürün Kalitesi
                                </TableCell>
                                {['Çok Kötü', 'Kötü', 'Orta', 'İyi', 'Çok İyi'].map((label) => (
                                    <TableCell align="center" key={label} sx={{borderRight: '1px solid #ddd'}}>
                                        <Checkbox
                                            checked={productQuality === label}
                                            onChange={handleCheckboxChange(setProductQuality, label)}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{borderRight: '1px solid #ddd'}}>
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
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{borderRight: '1px solid #ddd'}}>
                                    Genel Değerlendirme
                                </TableCell>
                                <TableCell colSpan={5} align="center">
                                    <Rating
                                        name="overall-rating"
                                        value={overallRating}
                                        precision={0.5} // Yarım yıldızların verilmesine olanak tanır
                                        onChange={(event, newValue) => {
                                            if (newValue !== null) {
                                                setOverallRating(newValue);
                                            }
                                        }}
                                        icon={<span style={{fontSize: '2rem'}}>★</span>}
                                        emptyIcon={<span style={{fontSize: '2rem'}}>☆</span>}
                                    />

                                </TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>

                </TableContainer>

                <Box sx={{mt: 4, textAlign: 'center'}}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Gönder
                    </Button>
                </Box>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                >
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{width: '100%'}}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
};

export default Evaluation;
