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
    Button,
    Snackbar,
    Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BreadcrumbComponent from "./BreadCrumb.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import '@fontsource/poppins';

const theme = createTheme({
    typography: {
        fontFamily: 'Poppins, sans-serif',
    },
});

const HarvestList = () => {
    const [harvests, setHarvests] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/sowings', { withCredentials: true })
            .then(response => {
                const sowingPromises = response.data.map(sowing =>
                    axios.get(`http://localhost:8080/sowings/${sowing.id}/hasat-durumu`, { withCredentials: true })
                        .then(hasatResponse => hasatResponse.data ? sowing : null)
                        .catch(error => {
                            console.error('Error fetching harvest status:', error);
                            return null;
                        })
                );

                Promise.all(sowingPromises).then(filteredSowings => {
                    const harvestedSowings = filteredSowings.filter(sowing => sowing !== null);
                    setHarvests(harvestedSowings);
                });
            })
            .catch(error => {
                console.error('Error fetching sowings:', error);
                if (error.response && error.response.status === 401) {
                    setIsAuthenticated(false);
                }
            });
    }, []);


    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    const handleDeleteHarvest = async (harvestId) => {
        try {
            // Hasatı sil
            await axios.delete(`http://localhost:8080/harvests/delete-by-sowing/${harvestId}`, { withCredentials: true });

            // Başarı mesajı
            setHarvests(prevHarvests => prevHarvests.filter(harvest => harvest.id !== harvestId));
            setSnackbarMessage('Hasat başarıyla silindi.');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Hasat silme sırasında hata oluştu:', error);
            setSnackbarMessage('Silme işlemi sırasında bir hata oluştu.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
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
        <ThemeProvider theme={theme}>
            <Container maxWidth="md">
                <Box>
                    <BreadcrumbComponent pageName="Hasatlarım" />
                </Box>
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h4" component="h2" gutterBottom>
                        Hasat Listesi
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="harvests table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="right">Plant</TableCell>
                                    <TableCell align="right">Planted Area</TableCell>
                                    <TableCell align="right">Sowing Type</TableCell>
                                    <TableCell align="right">Date</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {harvests.map((harvest) => (
                                    <TableRow key={harvest.id}>
                                        <TableCell component="th" scope="row">
                                            {harvest.landName}
                                        </TableCell>
                                        <TableCell align="right">{harvest.plantName}</TableCell>
                                        <TableCell align="right">{harvest.sowingField}</TableCell>
                                        <TableCell align="right">{harvest.sowingType}</TableCell>
                                        <TableCell align="right">{harvest.sowingDate}</TableCell>
                                        <TableCell align="right">
                                            <Button variant="contained" color="error" onClick={() => handleDeleteHarvest(harvest.id)}>
                                                Hasatı Sil
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
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
        </ThemeProvider>
    );
};

export default HarvestList;
