import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button, Accordion, AccordionSummary, AccordionDetails, TextField, InputAdornment, IconButton, MenuItem, Select, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BreadcrumbComponent from "./BreadCrumb.jsx";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import '@fontsource/poppins';

const theme = createTheme({
    typography: {
        fontFamily: 'Poppins, sans-serif',
    },
    palette: {
        primary: {
            main: '#ff8d00',
        },
        secondary: {
            main: '#007a37',
        },
        text: {
            primary: '#000000',
        }
    },
    components: {
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    backgroundColor: '#007a37',
                    color: 'white',
                    '& .MuiAccordionSummary-expandIconWrapper': {
                        color: 'white',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontFamily: 'Poppins, sans-serif',
                    textTransform: 'none',
                },
                containedPrimary: {
                    backgroundColor: '#ff8d00',
                    color: '#ffffff',
                    '&:hover': {
                        backgroundColor: '#e67c00',
                    },
                },
            },
        },
    },
});

const LandList = () => {
    const [lands, setLands] = useState([]);
    const [filteredLands, setFilteredLands] = useState([]);
    const [filter, setFilter] = useState({
        landName: '',
        cityName: '',
        districtName: '',
        minSize: '',
        maxSize: '',
    });
    const [sortConfig, setSortConfig] = useState({ key: 'landName', direction: 'asc' });
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedLand, setSelectedLand] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/lands', { withCredentials: true })
            .then(response => {
                const landData = response.data.content || response.data; // Eğer veri `content` içindeyse onu kullan
                setLands(landData);
                setFilteredLands(landData);
            })
            .catch(error => {
                console.error('Error fetching lands:', error);
                if (error.response && error.response.status === 401) {
                    setIsAuthenticated(false);
                }
            });
    }, []);


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

    const handleDetail = (id) => {
        navigate(`/lands/detail/${id}`);
    };

    const handleFilterChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        });
        setPage(1); // Filtre değiştiğinde sayfayı ilk sayfaya sıfırla
    };


    const handleClearFilter = (name) => {
        setFilter({
            ...filter,
            [name]: ''
        });
    };

    const handleSortChange = (event) => {
        const [key, direction] = event.target.value.split('-');
        setSortConfig({ key, direction });
    };

    const handleDeleteClick = (land) => {
        setSelectedLand(land);
        setOpenDialog(true);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(parseInt(event.target.value, 10));
        setPage(1); // Sayfa boyutu değiştiğinde sayfayı başa sıfırlayın
    };


    useEffect(() => {
        fetchFilteredLands(); // Filtreler veya sayfalama bilgisi değiştiğinde verileri yeniden çeker.
    }, [filter, page, pageSize]);


    const handleDeleteConfirm = () => {
        if (selectedLand) {
            axios.delete(`http://localhost:8080/lands/delete/${selectedLand.id}`)
                .then(() => {
                    setLands(lands.filter(land => land.id !== selectedLand.id));
                    setOpenDialog(false);
                    setSelectedLand(null);
                })
                .catch(error => {
                    console.error('Error deleting land:', error);
                });
        }
    };

    const renderFilters = () => (
        <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Filtrele</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        variant="outlined"
                        name="landName"
                        value={filter.landName}
                        onChange={handleFilterChange}
                        placeholder="Arazi Adı"
                        label="Arazi Adı"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="primary" />
                                </InputAdornment>
                            ),
                            endAdornment: filter.landName && (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => handleClearFilter('landName')}>
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        variant="outlined"
                        name="cityName"
                        value={filter.cityName}
                        onChange={handleFilterChange}
                        placeholder="Şehir"
                        label="Şehir"
                        InputProps={{
                            endAdornment: filter.cityName && (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => handleClearFilter('cityName')}>
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        variant="outlined"
                        name="districtName"
                        value={filter.districtName}
                        onChange={handleFilterChange}
                        placeholder="İlçe"
                        label="İlçe"
                        InputProps={{
                            endAdornment: filter.districtName && (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => handleClearFilter('districtName')}>
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            variant="outlined"
                            name="minSize"
                            value={filter.minSize}
                            onChange={handleFilterChange}
                            placeholder="Min Boyut"
                            label="Min Boyut (hektar)"
                            type="number"
                            InputProps={{
                                endAdornment: filter.minSize && (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => handleClearFilter('minSize')}>
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            variant="outlined"
                            name="maxSize"
                            value={filter.maxSize}
                            onChange={handleFilterChange}
                            placeholder="Max Boyut"
                            label="Max Boyut (hektar)"
                            type="number"
                            InputProps={{
                                endAdornment: filter.maxSize && (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => handleClearFilter('maxSize')}>
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    );

    const fetchFilteredLands = () => {
        const queryParams = new URLSearchParams({
            page: page - 1, // 0 tabanlı sayfa numarası
            size: pageSize, // Sayfa başına gösterilecek kayıt sayısı
            landName: filter.landName,
            cityName: filter.cityName,
            districtName: filter.districtName,
            minSize: filter.minSize,
            maxSize: filter.maxSize,
        });

        axios.get(`http://localhost:8080/lands?${queryParams.toString()}`, { withCredentials: true })
            .then(response => {
                console.log(response.data);  // Yanıtın içeriğini kontrol edin
                const landData = response.data.content || response.data;
                setLands(landData);
                setFilteredLands(landData);
                setTotalPages(response.data.totalPages);  // Toplam sayfa sayısını kontrol edin
            })
            .catch(error => {
                console.error('Arazileri getirirken hata oluştu:', error);
                if (error.response && error.response.status === 401) {
                    setIsAuthenticated(false);
                }
            });

    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="xl" sx={{ marginBottom: "60px" }}>
                <Box>
                    <BreadcrumbComponent pageName="Arazilerim" />
                </Box>
                <Box sx={{ mt: 3, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
                    <Box sx={{ width: isMobile ? '100%' : '25%' }}>
                        {renderFilters()}
                    </Box>
                    <Box sx={{ width: isMobile ? '100%' : '75%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                            <Select
                                value={`${sortConfig.key}-${sortConfig.direction}`}
                                onChange={handleSortChange}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Sıralama' }}
                            >
                                <MenuItem value="landName-asc">Arazi Adı (A-Z)</MenuItem>
                                <MenuItem value="landName-desc">Arazi Adı (Z-A)</MenuItem>
                                <MenuItem value="landSize-asc">Boyut (Küçükten Büyüğe)</MenuItem>
                                <MenuItem value="landSize-desc">Boyut (Büyükten Küçüğe)</MenuItem>
                            </Select>
                        </Box>
                        <Grid container spacing={3}>
                            {(Array.isArray(filteredLands) ? filteredLands : []).map((land) => (
                                <Grid item xs={12} sm={6} md={4} key={land.id}>
                                    <Card
                                        sx={{
                                            maxWidth: 345,
                                            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.2)',
                                            background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                                            borderRadius: '12px',
                                            '&:hover': {
                                                boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.3)',
                                                transform: 'translateY(-4px)',
                                            },
                                            padding: '16px',
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={land.imageUrl || "../../src/assets/DefaultImage/defaultLand.png"}
                                            alt={land.name}
                                            sx={{ borderRadius: "8px" }}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div" sx={{ color: '#000000' }}>
                                                {land.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Boyut: {land.landSize} hektar
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Şehir: {land.location.cityName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                İlçe: {land.location.districtName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Köy/Mahalle: {land.location.localityName || 'N/A'}
                                            </Typography>
                                        </CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Button variant="contained" color="primary" onClick={() => handleDetail(land.id)}>
                                                Düzenle
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => handleDeleteClick(land)}>
                                                Sil
                                            </Button>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Pagination ve Kart Sayısı Seçici */}
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Select
                                value={pageSize}
                                onChange={handlePageSizeChange}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Gösterim Sayısı' }}
                            >
                                <MenuItem value={6}>6</MenuItem>
                                <MenuItem value={12}>12</MenuItem>
                                <MenuItem value={24}>24</MenuItem>
                            </Select>

                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    </Box>
                </Box>

                {/* Silme Onayı Modal */}
                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Arazinizi silmek istediğinize emin misiniz?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {selectedLand && `${selectedLand.name} adlı araziyi silmek istediğinize emin misiniz?`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)} color="primary">
                            Hayır
                        </Button>
                        <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                            Evet
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ThemeProvider>
    );
};

export default LandList;

