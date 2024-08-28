import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Snackbar,
    Alert
} from '@mui/material';
import axios from 'axios';

const EvaluationList = ({ harvestId }) => {
    const [evaluation, setEvaluation] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        if (harvestId) {
            axios.get(`http://localhost:8080/evaluations/harvest/${harvestId}`, { withCredentials: true })
                .then(response => {
                    setEvaluation(response.data);
                })
                .catch(error => {
                    console.error('Error fetching evaluation:', error);
                    if (error.response && error.response.status === 401) {
                        setIsAuthenticated(false);
                    }
                });
        }
    }, [harvestId]);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (!isAuthenticated) {
        return (
            <Container maxWidth="md">
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" color="error">
                        Oturum açmadan görüntüleyemezsiniz.
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl">
            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Değerlendirme Detayı
                </Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="evaluation table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Arazi Adı</TableCell>
                                <TableCell align="right">Ekim Bitkisi</TableCell>
                                <TableCell align="right">Ekim Tarihi</TableCell>
                                <TableCell align="right">Hasat Tarihi</TableCell>
                                <TableCell align="right">Değerlendirme Tarihi</TableCell>
                                <TableCell align="right">Ürün Kalitesi</TableCell>
                                <TableCell align="right">Genel Değerlendirme</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {evaluation ? (
                                <TableRow key={evaluation.id}>
                                    <TableCell component="th" scope="row">
                                        {evaluation.landName}
                                    </TableCell>
                                    <TableCell align="right">{evaluation.sowingPlant}</TableCell>
                                    <TableCell align="right">{new Date(evaluation.sowingDate).toLocaleDateString()}</TableCell>
                                    <TableCell align="right">{new Date(evaluation.harvestDate).toLocaleDateString()}</TableCell>
                                    <TableCell align="right">{new Date(evaluation.evaluationDate).toLocaleDateString()}</TableCell>
                                    <TableCell align="right">{evaluation.productQuality}</TableCell>
                                    <TableCell align="right">{evaluation.overallRating}</TableCell>
                                </TableRow>
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        Değerlendirme bulunamadı.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
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

export default EvaluationList;
