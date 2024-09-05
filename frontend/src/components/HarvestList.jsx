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
    Alert,
    Modal,
    Backdrop,
    Fade
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
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedHarvestId, setSelectedHarvestId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');

        if (userId) {
            axios.get(`http://localhost:8080/harvests/user/${userId}`, { withCredentials: true })
                .then(response => {
                    setHarvests(response.data);
                })
                .catch(error => {
                    console.error('Hasatları getirirken hata oluştu:', error);
                    if (error.response && error.response.status === 401) {
                        setIsAuthenticated(false);
                    }
                });
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleDeleteConfirmation = (harvestId) => {
        setSelectedHarvestId(harvestId);
        setModalOpen(true);
    };

    const handleDeleteHarvest = async () => {
        try {
            await axios.delete(`http://localhost:8080/harvests/delete/${selectedHarvestId}`, { withCredentials: true });

            setHarvests(prevHarvests => prevHarvests.filter(harvest => harvest.id !== selectedHarvestId));
            setSnackbarMessage('Hasat başarıyla silindi.');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setModalOpen(false);
        } catch (error) {
            console.error('Hasat silme sırasında hata oluştu:', error);
            setSnackbarMessage('Silme işlemi sırasında bir hata oluştu.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setModalOpen(false);
        }
    };

    const handleModalClose = () => {
        setModalOpen(false);
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
                                        <TableCell align="right">{harvest.landType}</TableCell>
                                        <TableCell align="right">{harvest.sowingDate}</TableCell>
                                        <TableCell align="right">
                                            <Button variant="contained" color="error" onClick={() => handleDeleteConfirmation(harvest.id)}>
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

                <Modal
                    open={modalOpen}
                    onClose={handleModalClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={modalOpen}>
                        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                            <Typography variant="h6" component="h2">
                                Hasat İşlemini Silmek İstiyor musunuz?
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                                Hasat işlemini sildiğinizde ekim işleminiz durur ve Ekimi silme işleminden sonra tekrar hasat edebilirsiniz. Sadece yanlışlık vb. durumlar için silmeniz tavsiye edilir.
                            </Typography>
                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button variant="contained" color="secondary" onClick={handleModalClose} sx={{ mr: 2 }}>
                                    İptal
                                </Button>
                                <Button variant="contained" color="error" onClick={handleDeleteHarvest}>
                                    Sil
                                </Button>
                            </Box>
                        </Box>
                    </Fade>
                </Modal>
            </Container>
        </ThemeProvider>
    );
};

export default HarvestList;
