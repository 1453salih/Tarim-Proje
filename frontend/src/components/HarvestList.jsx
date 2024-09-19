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
    TextField,
    InputAdornment,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TablePagination,
    Button,
    Snackbar,
    Alert,
    Modal,
    Backdrop,
    Fade,
    TableSortLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import BreadcrumbComponent from "./BreadCrumb.jsx";
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

const HarvestList = () => {
    const [harvests, setHarvests] = useState([]);
    const [filteredHarvests, setFilteredHarvests] = useState([]);
    const [filter, setFilter] = useState({
        plantName: '',
        landName: '',
        minArea: '',
        maxArea: '',
        startDate: '',
        endDate: ''
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [orderBy, setOrderBy] = useState('');
    const [orderDirection, setOrderDirection] = useState('asc');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedHarvestId, setSelectedHarvestId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchFilteredHarvests();
    }, [filter, page, rowsPerPage, orderBy, orderDirection]);

    //! Yol yanlış olduğu için burada doğrusunu girmeliyim.
    const getSortField = (orderBy) => {
        switch (orderBy) {
            case 'landType':
                return 'sowing.land.landType';
            case 'plantName':
                return 'sowing.plant.name';
            case 'sowingField':
                return 'sowing.sowingField';
            case 'sowingDate':
                return 'sowing.sowingDate';
            case 'landName':
                return 'sowing.land.name';
            default:
                return orderBy;
        }
    };

    const fetchFilteredHarvests = () => {
        const queryParams = new URLSearchParams({
            page,
            size: rowsPerPage,
            plantName: filter.plantName,
            landName: filter.landName,
            minArea: filter.minArea,
            maxArea: filter.maxArea,
            startDate: filter.startDate,
            endDate: filter.endDate,
            sortBy: getSortField(orderBy),
            sortDirection: orderDirection
        });

        axios.get(`http://localhost:8080/harvests/user/${localStorage.getItem('userId')}?${queryParams.toString()}`, { withCredentials: true })
            .then(response => {
                const harvestData = response.data.content || response.data;
                setHarvests(harvestData);
                setFilteredHarvests(harvestData);
                setTotalRows(response.data.totalElements);
            })
            .catch(error => {
                console.error('Hasatları getirirken hata oluştu:', error);
            });
    };





    const handleFilterChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        });
        setPage(0);
    };

    const handleClearFilter = (name) => {
        setFilter({
            ...filter,
            [name]: ''
        });
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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

    const handleSort = (property) => {
        const isAsc = orderBy === property && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);

        // Frontend sıralaması
        const sortedData = [...filteredHarvests].sort((a, b) => {
            if (isAsc) {
                return a[property] < b[property] ? -1 : 1;
            } else {
                return a[property] > b[property] ? -1 : 1;
            }
        });

        setFilteredHarvests(sortedData);
    };

    const renderFilters = () => (
        <Accordion defaultExpanded sx={{ border: '1px solid #007a37' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Filtrele</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        variant="outlined"
                        name="plantName"
                        value={filter.plantName}
                        onChange={handleFilterChange}
                        placeholder="Bitki Adı"
                        label="Bitki Adı"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="primary" />
                                </InputAdornment>
                            ),
                            endAdornment: filter.plantName && (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => handleClearFilter('plantName')}>
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        variant="outlined"
                        name="landName"
                        value={filter.landName}
                        onChange={handleFilterChange}
                        placeholder="Arazi Adı"
                        label="Arazi Adı"
                        InputProps={{
                            endAdornment: filter.landName && (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => handleClearFilter('landName')}>
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            variant="outlined"
                            name="minArea"
                            value={filter.minArea}
                            onChange={handleFilterChange}
                            placeholder="Min Alan"
                            label="Min Alan (m²)"
                            type="number"
                            InputProps={{
                                endAdornment: filter.minArea && (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => handleClearFilter('minArea')}>
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            variant="outlined"
                            name="maxArea"
                            value={filter.maxArea}
                            onChange={handleFilterChange}
                            placeholder="Max Alan"
                            label="Max Alan (m²)"
                            type="number"
                            InputProps={{
                                endAdornment: filter.maxArea && (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => handleClearFilter('maxArea')}>
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            variant="outlined"
                            name="startDate"
                            value={filter.startDate}
                            onChange={handleFilterChange}
                            label="Başlangıç Tarihi"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            variant="outlined"
                            name="endDate"
                            value={filter.endDate}
                            onChange={handleFilterChange}
                            label="Bitiş Tarihi"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    );

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="xl">
                <Box>
                    <BreadcrumbComponent pageName="Hasatlarım" />
                </Box>
                <Box
                    sx={{
                        mt: 3,
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 3
                    }}
                >
                    <Box sx={{ width: { xs: '100%', md: '25%' } }}>
                        {renderFilters()}
                    </Box>
                    <Box sx={{ width: { xs: '100%', md: '75%' } }}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#007a37' }}>
                                        <TableCell sx={{ color: 'white' }}>
                                            <TableSortLabel
                                                active={orderBy === 'landName'}
                                                direction={orderBy === 'landName' ? orderDirection : 'asc'}
                                                onClick={() => handleSort('landName')}
                                                sx={{ color: 'white' }}
                                            >
                                                Arazi Adı
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: 'white' }}>
                                            <TableSortLabel
                                                active={orderBy === 'plantName'}
                                                direction={orderBy === 'plantName' ? orderDirection : 'asc'}
                                                onClick={() => handleSort('plantName')}
                                                sx={{ color: 'white' }}
                                            >
                                                Bitki Adı
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: 'white' }}>
                                            <TableSortLabel
                                                active={orderBy === 'sowingField'}
                                                direction={orderBy === 'sowingField' ? orderDirection : 'asc'}
                                                onClick={() => handleSort('sowingField')}
                                                sx={{ color: 'white' }}
                                            >
                                                Ekim Alanı
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: 'white' }}>
                                            <TableSortLabel
                                                active={orderBy === 'landType'}
                                                direction={orderBy === 'landType' ? orderDirection : 'asc'}
                                                onClick={() => handleSort('landType')}
                                                sx={{ color: 'white' }}
                                            >
                                                Ekim Türü
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: 'white' }}>
                                            <TableSortLabel
                                                active={orderBy === 'sowingDate'}
                                                direction={orderBy === 'sowingDate' ? orderDirection : 'asc'}
                                                onClick={() => handleSort('sowingDate')}
                                                sx={{ color: 'white' }}
                                            >
                                                Tarih
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: 'white' }}>
                                            Aksiyonlar
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredHarvests.map((harvest) => (
                                        <TableRow key={harvest.id}>
                                            <TableCell>{harvest.landName}</TableCell>
                                            <TableCell align="right">{harvest.plantName}</TableCell>
                                            <TableCell align="right">{harvest.sowingField}</TableCell>
                                            <TableCell align="right">{harvest.landType}</TableCell>
                                            <TableCell align="right">{harvest.sowingDate}</TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleDeleteConfirmation(harvest.id)}
                                                >
                                                    Hasatı Sil
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={totalRows}
                                page={page}
                                onPageChange={handlePageChange}
                                rowsPerPage={rowsPerPage}
                                labelRowsPerPage="Gösterim: "
                                onRowsPerPageChange={handleRowsPerPageChange}
                            />
                        </TableContainer>
                    </Box>
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
                                Hasat işlemini sildiğinizde ekim işleminiz durur ve ekim işleminden sonra tekrar hasat edebilirsiniz. Sadece yanlışlık vb. durumlar için silmeniz tavsiye edilir.
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
