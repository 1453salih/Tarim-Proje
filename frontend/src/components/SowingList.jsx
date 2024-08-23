import React, {useState, useEffect} from 'react';
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
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import BreadcrumbComponent from "./BreadCrumb.jsx";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import '@fontsource/poppins';

const theme = createTheme({
    typography: {
        fontFamily: 'Poppins, sans-serif',
    },
});

const SowingList = () => {
    const [sowings, setSowings] = useState([]);
    const [harvestedSowingIds, setHarvestedSowingIds] = useState([]); // Hasat edilen ekimlerin ID'leri
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/sowings', {withCredentials: true})
            .then(response => {
                console.log('Response:', response);
                setSowings(response.data);

                // Hasat durumunu kontrol etmek için her ekim kaydı için istek yapıyoruz
                response.data.forEach(sowing => {
                    axios.get(`http://localhost:8080/sowings/${sowing.id}/hasat-durumu`, {withCredentials: true})
                        .then(hasatResponse => {
                            if (hasatResponse.data) {  // hasatResponse.data true ise
                                setHarvestedSowingIds(prevIds => [...prevIds, sowing.id]);
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching harvested sowings:', error);
                        });
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

    if (!isAuthenticated) {
        return (
            <Container maxWidth="md">
                <Box sx={{mt: 3}}>
                    <Typography variant="h6" color="error">
                        Oturum açmadan görüntüleyemezsiniz.
                    </Typography>
                </Box>
            </Container>
        );
    }

    const handleDetail = (id) => {
        navigate(`/sowings/detail/${id}`);
    };

    const handleHarvest = (id) => {
        const harvestDto = {
            sowingId: id,
            harvestDate: new Date().toISOString().split('T')[0]
        };

        axios.post('http://localhost:8080/harvests', harvestDto, { withCredentials: true })
            .then(response => {
                console.log('Hasat işlemi başarılı:', response);
                console.log('Response Data:', response.data);  // Tüm response.data içeriğini loglayalım

                // Burada response.data.id kontrol ediliyor.
                if (response.data && response.data.id) {
                    const harvestId = response.data.id;  // Doğru ID'yi alıyoruz
                    console.log('Oluşturulan harvest ID:', harvestId);

                    setSnackbarMessage('Hasat işlemi başarılı!');
                    setSnackbarSeverity('success');
                    setSnackbarOpen(true);

                    // Hasat edilen ID'yi harvestedSowingIds listesine ekle
                    setHarvestedSowingIds(prevIds => [...prevIds, id]);

                    // Yönlendirme işlemi harvestId ile
                    setTimeout(() => navigate(`/evaluation`, { state: { harvestId: harvestId } }), 1500);
                } else {
                    console.error('Harvest ID response data is missing:', response);
                    setSnackbarMessage('Hasat işlemi başarılı, ancak Harvest ID alınamadı.');
                    setSnackbarSeverity('warning');
                    setSnackbarOpen(true);
                }
            })
            .catch(error => {
                console.error('Hasat işlemi sırasında hata oluştu:', error);
                setSnackbarMessage('Hasat işlemi sırasında bir hata oluştu.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };



    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="xl">
                <Box>
                    <BreadcrumbComponent pageName="Ekimlerim"/>
                </Box>
                <Box sx={{mt: 3}}>
                    <Typography variant="h4" component="h2" gutterBottom>
                        Sowings List
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 650}} aria-label="sowings table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="right">Plant</TableCell>
                                    <TableCell align="right">Planted Area</TableCell>
                                    <TableCell align="right">Uncultivated Area</TableCell>
                                    <TableCell align="right">Sowing Type</TableCell>
                                    <TableCell align="right">Date</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sowings.map((sowing) => (
                                    <TableRow key={sowing.id}>
                                        <TableCell component="th" scope="row">
                                            {sowing.landName}
                                        </TableCell>
                                        <TableCell align="right">{sowing.plantName}</TableCell>
                                        <TableCell align="right">{sowing.sowingField}</TableCell>
                                        <TableCell align="right">{sowing.sowingType}</TableCell>
                                        <TableCell align="right">1</TableCell>
                                        <TableCell align="right">{sowing.sowingDate}</TableCell>
                                        <TableCell align="right" sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Button variant="contained" color="primary"
                                                    onClick={() => handleDetail(sowing.id)} sx={{ml: 1}}>
                                                Detay
                                            </Button>
                                            {harvestedSowingIds.includes(sowing.id) ? (
                                                <Button variant="contained" color="secondary" disabled sx={{ minWidth:'140px'}}>
                                                    Hasat Yapıldı
                                                </Button>
                                            ) : (
                                                <Button variant="contained" color="warning"
                                                        onClick={() => handleHarvest(sowing.id)}
                                                        sx={{minWidth: '150px'}}>
                                                    Hasat Et
                                                </Button>
                                            )}
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
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{width: '100%'}}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
};

export default SowingList;
