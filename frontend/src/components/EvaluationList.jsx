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
    TextField,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    MenuItem,
    useMediaQuery,
    InputAdornment,
    Skeleton,
    TableSortLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import BreadcrumbComponent from "./BreadCrumb.jsx";
import axios from "axios";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import '@fontsource/poppins';

const theme = createTheme({
    typography: {
        fontFamily: 'Poppins, sans-serif',
    },
    palette: {
        primary: {
            main: '#ff6305', // Turuncu
        },
        secondary: {
            main: '#f9f9f9', // Hafif gri arka plan
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
        MuiButton: {
            styleOverrides: {
                containedPrimary: {
                    backgroundColor: '#ff6305',
                    '&:hover': {
                        backgroundColor: '#e55a04',
                    },
                },
            },
        },
        MuiTableSortLabel: {
            styleOverrides: {
                icon: {
                    color: '#ff6305 !important', // İkonu turuncu yap
                },
                active: {
                    color: '#ff6305', // Aktifken turuncu yap
                },
                root: {
                    '&:hover': {
                        color: '#000000', // Hover durumunda siyah yap
                        '& .MuiTableSortLabel-icon': {
                            color: '#000000 !important', // İkonu hover'da siyah yap
                        },
                    },
                },
            },
        },
    },
});

const qualityOptions = [
    { value: '', label: 'Tümü' },
    { value: 'Çok İyi', label: 'Çok İyi' },
    { value: 'İyi', label: 'İyi' },
    { value: 'Orta', label: 'Orta' },
    { value: 'Kötü', label: 'Kötü' },
    { value: 'Çok Kötü', label: 'Çok Kötü' },
];

const EvaluationList = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [filteredEvaluations, setFilteredEvaluations] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [filter, setFilter] = useState({
        landName: '',
        plantName: '',
        sowingDate: null,
        harvestDate: null,
        harvestCondition: '',
        productQuality: '',
        productQuantityMin: '',
        productQuantityMax: '',
    });
    const [sortConfig, setSortConfig] = useState({ key: 'landName', direction: 'asc' });
    const [imageLoading, setImageLoading] = useState({});
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        axios.get('http://localhost:8080/evaluations', { withCredentials: true })
            .then(response => {
                console.log(response.data);
                setEvaluations(response.data);
                setFilteredEvaluations(response.data);
            })
            .catch(error => {
                console.error('Error fetching evaluations:', error);
                if (error.response && error.response.status === 401) {
                    setIsAuthenticated(false);
                }
            });
    }, []);

    useEffect(() => {
        const filteredData = evaluations.filter(evaluation => {
            const sowingDateMatch = filter.sowingDate === null || dayjs(evaluation.sowingDate).isSame(dayjs(filter.sowingDate), 'day');
            const harvestDateMatch = filter.harvestDate === null || dayjs(evaluation.harvestDate).isSame(dayjs(filter.harvestDate), 'day');
            const harvestConditionMatch = filter.harvestCondition === '' || evaluation.harvestCondition.toLowerCase() === filter.harvestCondition.toLowerCase();
            const productQualityMatch = filter.productQuality === '' || evaluation.productQuality.toLowerCase() === filter.productQuality.toLowerCase();
            const productQuantityMatch =
                (filter.productQuantityMin === '' || evaluation.productQuantity >= parseFloat(filter.productQuantityMin)) &&
                (filter.productQuantityMax === '' || evaluation.productQuantity <= parseFloat(filter.productQuantityMax));

            return evaluation.landName.toLowerCase().includes(filter.landName.toLowerCase()) &&
                evaluation.plantName.toLowerCase().includes(filter.plantName.toLowerCase()) &&
                sowingDateMatch &&
                harvestDateMatch &&
                harvestConditionMatch &&
                productQualityMatch &&
                productQuantityMatch;
        });

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

        setFilteredEvaluations(sortedData);
    }, [filter, evaluations, sortConfig]);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleDetail = (evaluationId) => {
        if (evaluationId) {
            console.log(evaluationId);
            navigate(`/evaluation/edit/${evaluationId}`); // evaluation ID ile yönlendirme
        } else {
            console.error('Evaluation ID bulunamadı');
        }
    };





    const handleFilterChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        });
    };

    dayjs.extend(utc);
    dayjs.extend(timezone);

    const handleDateChange = (name, date) => {
        if (date) {
            const adjustedDate = dayjs(date).tz("Europe/Istanbul").startOf('day');
            setFilter({
                ...filter,
                [name]: adjustedDate
            });
        } else {
            setFilter({
                ...filter,
                [name]: null
            });
        }
    };

    const handleClearDate = (name) => {
        setFilter({
            ...filter,
            [name]: null
        });
    };

    const handleImageLoad = (id) => {
        setImageLoading(prevState => ({
            ...prevState,
            [id]: false
        }));
    };

    const handleImageError = (id) => {
        setImageLoading(prevState => ({
            ...prevState,
            [id]: false
        }));
    };

    const handleSortRequest = (key) => {
        const isAsc = sortConfig.key === key && sortConfig.direction === 'asc';
        setSortConfig({ key, direction: isAsc ? 'desc' : 'asc' });
    };

    const renderFilters = () => (
        <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Filtreler</Typography>
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
                                    <IconButton onClick={() => setFilter({ ...filter, landName: '' })}>
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& label.Mui-focused': { color: '#ff6305' },
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff6305' }
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
                                    <IconButton onClick={() => setFilter({ ...filter, plantName: '' })}>
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& label.Mui-focused': { color: '#ff6305' },
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff6305' }
                        }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <DatePicker
                            label="Ekim Tarihi"
                            value={filter.sowingDate}
                            onChange={(date) => handleDateChange('sowingDate', date)}
                            slotProps={{ textField: { fullWidth: true } }}
                            sx={{
                                '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff6305' },
                                '& .MuiFormLabel-root.Mui-focused': { color: '#ff6305' }
                            }}
                        />
                        {filter.sowingDate && (
                            <IconButton onClick={() => handleClearDate('sowingDate')} sx={{ color: '#ff6305' }}>
                                <ClearIcon />
                            </IconButton>
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <DatePicker
                            label="Hasat Tarihi"
                            value={filter.harvestDate}
                            onChange={(date) => handleDateChange('harvestDate', date)}
                            slotProps={{ textField: { fullWidth: true } }}
                            sx={{
                                '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff6305' },
                                '& .MuiFormLabel-root.Mui-focused': { color: '#ff6305' }
                            }}
                        />
                        {filter.harvestDate && (
                            <IconButton onClick={() => handleClearDate('harvestDate')} sx={{ color: '#ff6305' }}>
                                <ClearIcon />
                            </IconButton>
                        )}
                    </Box>
                    <TextField
                        select
                        variant="outlined"
                        name="harvestCondition"
                        value={filter.harvestCondition}
                        onChange={handleFilterChange}
                        label="Hasat Durumu"
                        InputProps={{
                            endAdornment: filter.harvestCondition && (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setFilter({ ...filter, harvestCondition: '' })}>
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& label.Mui-focused': { color: '#ff6305' },
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff6305' }
                        }}
                    >
                        {qualityOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        variant="outlined"
                        name="productQuality"
                        value={filter.productQuality}
                        onChange={handleFilterChange}
                        label="Ürün Kalitesi"
                        InputProps={{
                            endAdornment: filter.productQuality && (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setFilter({ ...filter, productQuality: '' })}>
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& label.Mui-focused': { color: '#ff6305' },
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff6305' }
                        }}
                    >
                        {qualityOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            variant="outlined"
                            name="productQuantityMin"
                            value={filter.productQuantityMin}
                            onChange={handleFilterChange}
                            placeholder="Min Miktar"
                            label="Min Miktar"
                            type="number"
                            InputProps={{
                                endAdornment: filter.productQuantityMin && (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setFilter({ ...filter, productQuantityMin: '' })}>
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& label.Mui-focused': { color: '#ff6305' },
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff6305' }
                            }}
                        />
                        <TextField
                            variant="outlined"
                            name="productQuantityMax"
                            value={filter.productQuantityMax}
                            onChange={handleFilterChange}
                            placeholder="Max Miktar"
                            label="Max Miktar"
                            type="number"
                            InputProps={{
                                endAdornment: filter.productQuantityMax && (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setFilter({ ...filter, productQuantityMax: '' })}>
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& label.Mui-focused': { color: '#ff6305' },
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff6305' }
                            }}
                        />
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    );


    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Container maxWidth="xl">
                    <Box>
                        <BreadcrumbComponent pageName="Değerlendirmelerim" />
                    </Box>
                    <Box sx={{ mt: 3, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
                        <Box sx={{ width: isMobile ? '100%' : '25%' }}>
                            {renderFilters()}
                        </Box>
                        <Box sx={{ width: isMobile ? '100%' : '75%' }}>
                            <TableContainer component={Paper}  sx={{borderColor: theme.palette.primary.main }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortConfig.key === 'landName'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSortRequest('landName')}
                                                >
                                                    Arazi Adı
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>Arazi Fotoğrafı</TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortConfig.key === 'plantName'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSortRequest('plantName')}
                                                >
                                                    Bitki Adı
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>Bitki Fotoğrafı</TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortConfig.key === 'sowingDate'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSortRequest('sowingDate')}
                                                >
                                                    Ekim Tarihi
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortConfig.key === 'harvestDate'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSortRequest('harvestDate')}
                                                >
                                                    Hasat Tarihi
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortConfig.key === 'harvestCondition'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSortRequest('harvestCondition')}
                                                >
                                                    Hasat Durumu
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortConfig.key === 'productQuality'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSortRequest('productQuality')}
                                                >
                                                    Ürün Kalitesi
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortConfig.key === 'productQuantity'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSortRequest('productQuantity')}
                                                >
                                                    Ürün Miktarı
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>İşlemler</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredEvaluations.map((evaluation) => (
                                            <TableRow key={evaluation.id} sx={{ '&:hover': { backgroundColor: '#fff7e6' } }}>
                                                <TableCell>{evaluation.landName}</TableCell>
                                                <TableCell>
                                                    {imageLoading[evaluation.id] !== false && (
                                                        <Skeleton variant="rectangular" width={50} height={50} />
                                                    )}
                                                    <img
                                                        src={evaluation.landImageUrl || '/path/to/placeholder-image.jpg'}
                                                        alt="Arazi Fotoğrafı"
                                                        style={{
                                                            width: 50,
                                                            height: 50,
                                                            display: imageLoading[evaluation.id] === false ? 'block' : 'none',
                                                            objectFit: 'cover',
                                                            borderRadius: '4px'
                                                        }}
                                                        onLoad={() => handleImageLoad(evaluation.id)}
                                                        onError={() => handleImageError(evaluation.id)}
                                                    />
                                                </TableCell>
                                                <TableCell>{evaluation.plantName}</TableCell>
                                                <TableCell>
                                                    {imageLoading[evaluation.id] !== false && (
                                                        <Skeleton variant="rectangular" width={50} height={50} />
                                                    )}
                                                    <img
                                                        src={evaluation.plantImageUrl || '/path/to/placeholder-image.jpg'}
                                                        alt="Bitki Fotoğrafı"
                                                        style={{
                                                            width: 50,
                                                            height: 50,
                                                            display: imageLoading[evaluation.id] === false ? 'block' : 'none',
                                                            objectFit: 'cover',
                                                            borderRadius: '4px'
                                                        }}
                                                        onLoad={() => handleImageLoad(evaluation.id)}
                                                        onError={() => handleImageError(evaluation.id)}
                                                    />
                                                </TableCell>
                                                <TableCell>{dayjs(evaluation.sowingDate).format('DD/MM/YYYY')}</TableCell>
                                                <TableCell>{dayjs(evaluation.harvestDate).format('DD/MM/YYYY')}</TableCell>
                                                <TableCell>{evaluation.harvestCondition}</TableCell>
                                                <TableCell>{evaluation.productQuality}</TableCell>
                                                <TableCell>{evaluation.productQuantity}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleDetail(evaluation.evaluationId || evaluation.id)} // evaluationId ya da id'yi kontrol edin
                                                        sx={{ color: 'white' }}
                                                    >
                                                        Düzenle
                                                    </Button>
                                                </TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
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
                </Container>
            </LocalizationProvider>
        </ThemeProvider>
    );
};

export default EvaluationList;
