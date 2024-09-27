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
    Alert,
    TextField,
    IconButton,
    InputAdornment,
    MenuItem,
    TableSortLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useMediaQuery,
    Pagination,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import dayjs from 'dayjs';
import '@fontsource/poppins';
import axios from 'axios';
import BreadcrumbComponent from './BreadCrumb.jsx';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import NoResult from "./NoResults.jsx";
import { TablePagination } from '@mui/material';


const theme = createTheme({
    typography: {
        fontFamily: 'Poppins, sans-serif',
    },
    palette: {
        primary: {
            main: '#007a37', // Yeşil
        },
        secondary: {
            main: '#ff6305', // Turuncu
        },
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
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: '#007a37',
                    '& .MuiTableCell-root': {
                        color: 'white',
                        fontWeight: 'bold',
                    },
                },
            },
        },
        MuiTableSortLabel: {
            styleOverrides: {
                root: {
                    '&.Mui-active': {
                        color: '#ff6305', // Aktif durumda turuncu renk
                    },
                    '&:hover': {
                        color: '#000000', // Hover durumunda siyah renk
                        '& .MuiTableSortLabel-icon': {
                            color: '#000000 !important', // İkon hover durumunda siyah
                        },
                    },
                },
                icon: {
                    color: '#ff6305 !important', // İkon turuncu renk
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    color: 'white', // Buton metinlerini beyaz yapar
                },
            },
        },
    },
});

const landTypes = [
    {value: '', label: 'Tümü'},
    {value: 'Tarla', label: 'Tarla'},
    {value: 'Bağ', label: 'Bağ'},
    {value: 'Bahçe', label: 'Bahçe'},
    {value: 'Zeytinlik', label: 'Zeytinlik'},
    {value: 'Mera', label: 'Mera'},
    {value: 'Çayır', label: 'Çayır'},
];

const SowingList = () => {
    const [sowings, setSowings] = useState([]);
    const [filteredSowings, setFilteredSowings] = useState([]);
    const [harvestedSowingIds, setHarvestedSowingIds] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [filter, setFilter] = useState({
        landName: '',
        plantName: '',
        sowingDate: null,
        landType: '',
        sowingFieldMin: '',
        sowingFieldMax: '',
    });
    const [sortConfig, setSortConfig] = useState({key: 'landName', direction: 'asc'});

    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        // Fetch sowings with pagination
        axios.get(`http://localhost:8080/sowings?page=${page - 1}&size=${pageSize}`, {withCredentials: true})
            .then(response => {
                setSowings(response.data.content);
                setFilteredSowings(response.data.content);
                setTotalPages(response.data.totalPages);

                response.data.content.forEach(sowing => {
                    axios.get(`http://localhost:8080/sowings/${sowing.id}/hasat-durumu`, {withCredentials: true})
                        .then(hasatResponse => {
                            if (hasatResponse.data) {
                                setHarvestedSowingIds(prevIds => [...prevIds, sowing.id]);
                            }
                        });
                });
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    setIsAuthenticated(false);
                }
            });
    }, [page, pageSize]); // page ve pageSize değiştikçe veriyi tekrar çeker

    useEffect(() => {
        const filteredData = Array.isArray(sowings) ? sowings.filter(sowing => {
            const sowingDateMatch = filter.sowingDate === null || dayjs(sowing.sowingDate).isSame(dayjs(filter.sowingDate), 'day');
            const sowingFieldMatch =
                (filter.sowingFieldMin === '' || sowing.sowingField >= parseFloat(filter.sowingFieldMin)) &&
                (filter.sowingFieldMax === '' || sowing.sowingField <= parseFloat(filter.sowingFieldMax));

            return sowing.landName.toLowerCase().includes(filter.landName.toLowerCase()) &&
                sowing.plantName.toLowerCase().includes(filter.plantName.toLowerCase()) &&
                sowingDateMatch &&
                (filter.landType === '' || sowing.landType === filter.landType) &&
                sowingFieldMatch;
        }) : [];

        const sortedData = filteredData.sort((a, b) => {
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

        setFilteredSowings(sortedData);
    }, [filter, sowings, sortConfig]);

    const handleFilterChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        });
    };

    const handleDateChange = (date) => {
        setFilter({
            ...filter,
            sowingDate: date
        });
    };

    const handleClearDate = () => {
        setFilter({
            ...filter,
            sowingDate: null
        });
    };

    const handleSortRequest = (key) => {
        const isAsc = sortConfig.key === key && sortConfig.direction === 'asc';
        setSortConfig({key, direction: isAsc ? 'desc' : 'asc'});
    };

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
                if (response.data && response.data.id) {
                    const harvestId = response.data.id;
                    setSnackbarMessage('Hasat işlemi başarılı!');
                    setSnackbarSeverity('success');
                    setSnackbarOpen(true);

                    setHarvestedSowingIds(prevIds => [...prevIds, id]);

                    setTimeout(() => navigate(`/evaluation`, { state: { harvestId: harvestId } }), 1500);
                } else {
                    setSnackbarMessage('Hasat işlemi başarılı, ancak Hasat ID alınamadı.');
                    setSnackbarSeverity('warning');
                    setSnackbarOpen(true);
                }
            })
            .catch(error => {
                setSnackbarMessage('Hasat işlemi sırasında bir hata oluştu.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };

    const renderFilters = () => (
        <Accordion defaultExpanded sx={{border: '1px solid #007a37'}}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{backgroundColor: '#007a37', color: 'white'}}>
                <Typography>Filtreler</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
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
                                    <SearchIcon sx={{color: '#ff6305'}} />
                                </InputAdornment>
                            ),
                            endAdornment: filter.landName && (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setFilter({...filter, landName: ''})}>
                                        <ClearIcon sx={{color: '#ff6305'}} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& label.Mui-focused': {color: '#ff6305'},
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {borderColor: '#ff6305'},
                        }}
                    />
                    <TextField
                        variant="outlined"
                        name="plantName"
                        value={filter.plantName}
                        onChange={handleFilterChange}
                        placeholder="Bitki Adı"
                        label="Bitki Adı"
                        InputProps={{
                            endAdornment: filter.plantName && (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setFilter({...filter, plantName: ''})}>
                                        <ClearIcon sx={{color: '#ff6305'}} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& label.Mui-focused': {color: '#ff6305'},
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {borderColor: '#ff6305'},
                        }}
                    />
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                        <DatePicker
                            label="Ekim Tarihi"
                            value={filter.sowingDate}
                            onChange={handleDateChange}
                            slotProps={{textField: {fullWidth: true}}}
                            sx={{
                                '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {borderColor: '#ff6305'},
                                '& .MuiFormLabel-root.Mui-focused': {color: '#ff6305'},
                            }}
                        />
                        {filter.sowingDate && (
                            <IconButton onClick={handleClearDate}>
                                <ClearIcon sx={{color: '#ff6305'}} />
                            </IconButton>
                        )}
                    </Box>
                    <TextField
                        select
                        variant="outlined"
                        name="landType"
                        value={filter.landType}
                        onChange={handleFilterChange}
                        label="Ekim Türü"
                        sx={{
                            '& label.Mui-focused': {color: '#ff6305'},
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {borderColor: '#ff6305'},
                        }}
                    >
                        {landTypes.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box sx={{display: 'flex', gap: 2}}>
                        <TextField
                            variant="outlined"
                            name="sowingFieldMin"
                            value={filter.sowingFieldMin}
                            onChange={handleFilterChange}
                            placeholder="Min Ekilen Alan"
                            label="Min Ekilen Alan"
                            type="number"
                            sx={{
                                '& label.Mui-focused': {color: '#ff6305'},
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {borderColor: '#ff6305'},
                            }}
                        />
                        <TextField
                            variant="outlined"
                            name="sowingFieldMax"
                            value={filter.sowingFieldMax}
                            onChange={handleFilterChange}
                            placeholder="Max Ekilen Alan"
                            label="Max Ekilen Alan"
                            type="number"
                            sx={{
                                '& label.Mui-focused': {color: '#ff6305'},
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {borderColor: '#ff6305'},
                            }}
                        />
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    );


    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage + 1); // TablePagination, 0 tabanlı bir sayfa numarası kullanır, bu yüzden +1 yapıyoruz.
    };

    const handlePageSizeChange = (event) => {
        setPageSize(parseInt(event.target.value, 10));
        setPage(1); // Sayfa boyutu değiştiğinde sayfayı başa almak mantıklı
    };



    return (
        <ThemeProvider theme={theme} >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Container maxWidth="xl">
                    <Box>
                        <BreadcrumbComponent pageName="Ekimlerim"/>
                    </Box>
                    <Box sx={{mt: 3, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 ,mb:5}}>
                        <Box sx={{width: isMobile ? '100%' : '25%'}}>
                            {renderFilters()}
                        </Box>
                        <Box sx={{width: isMobile ? '100%' : '75%'}}>
                            <TableContainer component={Paper} sx={{border: '1px solid #007a37'}}>
                                <Table sx={{minWidth: 650}} aria-label="ekimler tablosu">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">
                                                <TableSortLabel
                                                    active={sortConfig.key === 'landName'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSortRequest('landName')}
                                                >
                                                    Ad
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell align="center">Bitki</TableCell>
                                            <TableCell align="center">
                                                <TableSortLabel
                                                    active={sortConfig.key === 'sowingField'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSortRequest('sowingField')}
                                                >
                                                    Ekilen Alan
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell align="center">
                                                <TableSortLabel
                                                    active={sortConfig.key === 'clayableLand'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSortRequest('clayableLand')}
                                                >
                                                    Ekilmemiş Alan
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell align="center">Ekim Türü</TableCell>
                                            <TableCell align="center">
                                                <TableSortLabel
                                                    active={sortConfig.key === 'sowingDate'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSortRequest('sowingDate')}
                                                >
                                                    Tarih
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell align="center">İşlemler</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Array.isArray(filteredSowings) && filteredSowings.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7}>
                                                    <NoResult />
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            Array.isArray(filteredSowings) && filteredSowings.map((sowing) => (
                                                <TableRow key={sowing.id}>
                                                    <TableCell align="center">{sowing.landName}</TableCell>
                                                    <TableCell align="center">{sowing.plantName}</TableCell>
                                                    <TableCell align="center">{sowing.sowingField}</TableCell>
                                                    <TableCell align="center">{sowing.clayableLand}</TableCell>
                                                    <TableCell align="center">{sowing.landType}</TableCell>
                                                    <TableCell align="center">{dayjs(sowing.sowingDate).format('DD/MM/YYYY')}</TableCell>
                                                    <TableCell align="center" style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <div
                                                            style={{display: 'flex', gap: '10px', marginBottom: '8px'}}>
                                                            <Button variant="contained" color="primary"
                                                                    onClick={() => handleDetail(sowing.id)}>
                                                                Düzenle
                                                            </Button>
                                                            {harvestedSowingIds.includes(sowing.id) ? (
                                                                <Button variant="contained" color="secondary" disabled>
                                                                    Hasat Yapıldı
                                                                </Button>
                                                            ) : (
                                                                <Button variant="contained" color="warning"
                                                                        onClick={() => handleHarvest(sowing.id)}>
                                                                    Hasat Et
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    component="div"
                                    count={totalPages * pageSize} // Toplam veri sayısı
                                    page={page - 1} // TablePagination, 0 tabanlı olduğu için -1
                                    onPageChange={handlePageChange}
                                    rowsPerPage={pageSize}
                                    onRowsPerPageChange={handlePageSizeChange}
                                    labelRowsPerPage="Gösterim"
                                    rowsPerPageOptions={[10, 20, 50]}
                                />
                            </TableContainer>
                        </Box>
                    </Box>
                </Container>
            </LocalizationProvider>
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{width: '100%'}}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
};

export default SowingList;
