import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button, Accordion, AccordionSummary, AccordionDetails, TextField, InputAdornment, IconButton, MenuItem, Select, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BreadcrumbComponent from "./BreadCrumb.jsx";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import SortIcon from '@mui/icons-material/Sort';
import '@fontsource/poppins';

const theme = createTheme({
    typography: {
        fontFamily: 'Poppins, sans-serif',
    },
    palette: {
        primary: {
            main: '#ff8d00', // Detay butonları için turuncu renk
        },
        secondary: {
            main: '#007a37', // Accordion başlığı için yeşil renk
        },
        text: {
            primary: '#000000', // Kart başlığı için siyah renk
        }
    },
    components: {
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    backgroundColor: '#007a37', // Accordion başlığı için yeşil
                    color: 'white',
                    '& .MuiAccordionSummary-expandIconWrapper': {
                        color: 'white',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                containedPrimary: {
                    backgroundColor: '#ff8d00', // Detay butonları için turuncu
                    color: '#ffffff', // Beyaz yazı
                    '&:hover': {
                        backgroundColor: '#e67c00', // Hover rengi biraz daha koyu turuncu
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
    const [sortConfig, setSortConfig] = useState({ key: 'landName', direction: 'asc' }); // Sıralama bilgileri
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [openDialog, setOpenDialog] = useState(false); // Dialog (modal) kontrolü
    const [selectedLand, setSelectedLand] = useState(null); // Silinecek arazi bilgisi
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Ekran boyutu kontrolü
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/lands', { withCredentials: true })
            .then(response => {
                setLands(response.data);
                setFilteredLands(response.data); // İlk başta tüm arazileri göster
            })
            .catch(error => {
                console.error('Error fetching lands:', error);
                if (error.response && error.response.status === 401) {
                    setIsAuthenticated(false);
                }
            });
    }, []);

    useEffect(() => {
        let filteredData = lands.filter(land => {
            const landNameMatch = land.name.toLowerCase().includes(filter.landName.toLowerCase());
            const cityNameMatch = land.location.cityName.toLowerCase().includes(filter.cityName.toLowerCase());
            const districtNameMatch = land.location.districtName.toLowerCase().includes(filter.districtName.toLowerCase());
            const sizeMatch = (!filter.minSize || land.landSize >= parseFloat(filter.minSize)) &&
                (!filter.maxSize || land.landSize <= parseFloat(filter.maxSize));

            return landNameMatch && cityNameMatch && districtNameMatch && sizeMatch;
        });

        filteredData = filteredData.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            } else {
                return 0;
            }
        });

        setFilteredLands(filteredData);
    }, [filter, lands, sortConfig]);

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
        setSelectedLand(land); // Silinecek araziyi belirle
        setOpenDialog(true); // Modal'ı aç
    };

    const handleDeleteConfirm = () => {
        if (selectedLand) {
            axios.delete(`/lands/delete/${selectedLand.id}`)
                .then(() => {
                    setLands(lands.filter(land => land.id !== selectedLand.id)); // Silinen araziyi listeden çıkar
                    setOpenDialog(false); // Modal'ı kapat
                    setSelectedLand(null); // Seçili araziyi sıfırla
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
                            {filteredLands.map((land) => (
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
                                                Detay
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => handleDeleteClick(land)}>
                                                Sil
                                            </Button>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
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
