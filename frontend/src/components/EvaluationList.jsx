import React, {useState, useEffect} from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Snackbar,
    Alert,
    Skeleton,
    TextField,
    Paper,
    useMediaQuery,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    InputAdornment,
    MenuItem,
    IconButton
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import BreadcrumbComponent from "./BreadCrumb.jsx";

import '@fontsource/poppins';
import axios from "axios";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

const theme = createTheme({
    typography: {
        fontFamily: 'Poppins, sans-serif',
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
    const navigate = useNavigate();
    const [imageLoading, setImageLoading] = useState({});
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

    useEffect(() => {
        axios.get('http://localhost:8080/evaluations', {withCredentials: true})
            .then(response => {
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
        setFilteredEvaluations(filteredData);
    }, [filter, evaluations]);


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
        navigate(`/evaluations/detail/${id}`);
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
            const adjustedDate = dayjs(date).tz("Europe/Istanbul").startOf('day'); // Yerel zaman diliminizi burada belirleyin
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

    const renderFilters = () => (
        <Paper elevation={3} sx={{ mb: isLargeScreen ? 0 : 2 }}>
            <Accordion defaultExpanded sx={{
                '&.Mui-expanded': {
                    margin: 0,
                    borderColor: 'inherit', // Bu satır border renginin korunmasını sağlar
                    borderTop:'1px solid',
                    borderTopColor:'rgba(0, 0, 0, 0.12)',
                    borderBottom: '1px solid', // Alt border çizgisini yeniden tanımlar
                    borderBottomColor: 'rgba(0, 0, 0, 0.12)' // İsteğe bağlı olarak alt border rengi
                }
            }} >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{
                '&.Mui-expanded': {
                    margin: 0,
                    borderColor: 'inherit', // Bu satır border renginin korunmasını sağlar
                    borderTop:'1px solid',
                    borderTopColor:'rgba(0, 0, 0, 0.12)',
                    borderBottom: '1px solid', // Alt border çizgisini yeniden tanımlar
                    borderBottomColor: 'rgba(0, 0, 0, 0.12)' // İsteğe bağlı olarak alt border rengi
                }
            }}>
                    <Typography>Arazi Adı</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ borderTop:"2px solid #ff6305"}}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        name="landName"
                        value={filter.landName}
                        onChange={handleFilterChange}
                        placeholder="Ara..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{
                '&.Mui-expanded': {
                    margin: 0,
                    borderColor: 'inherit', // Bu satır border renginin korunmasını sağlar
                    borderTop:'1px solid',
                    borderTopColor:'rgba(0, 0, 0, 0.12)',
                    borderBottom: '1px solid', // Alt border çizgisini yeniden tanımlar
                    borderBottomColor: 'rgba(0, 0, 0, 0.12)' // İsteğe bağlı olarak alt border rengi
                }
            }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{
                '&.Mui-expanded': {
                    margin: 0,
                    borderColor: 'inherit', // Bu satır border renginin korunmasını sağlar
                    borderBottom: '1px solid', // Alt border çizgisini yeniden tanımlar
                    borderBottomColor: 'rgba(0, 0, 0, 0.12)' // İsteğe bağlı olarak alt border rengi
                }
            }}>
                    <Typography>Bitki Adı</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ borderTop:"2px solid #ff6305"}}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        name="plantName"
                        value={filter.plantName}
                        onChange={handleFilterChange}
                        placeholder="Bitki Adı"
                    />
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{
                '&.Mui-expanded': {
                    margin: 0,
                    borderColor: 'inherit', // Bu satır border renginin korunmasını sağlar
                    borderTop:'1px solid',
                    borderTopColor:'rgba(0, 0, 0, 0.12)',
                    borderBottom: '1px solid', // Alt border çizgisini yeniden tanımlar
                    borderBottomColor: 'rgba(0, 0, 0, 0.12)' // İsteğe bağlı olarak alt border rengi
                }
            }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{
                '&.Mui-expanded': {
                    margin: 0,
                    borderColor: 'inherit', // Bu satır border renginin korunmasını sağlar
                    borderBottom: '1px solid', // Alt border çizgisini yeniden tanımlar
                    borderBottomColor: 'rgba(0, 0, 0, 0.12)' // İsteğe bağlı olarak alt border rengi
                }
            }}>
                    <Typography>Ekim Tarihi</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ display: 'flex', alignItems: 'center' }}>
                    <DatePicker
                        label="Ekim Tarihi"
                        value={filter.sowingDate}
                        onChange={(date) => handleDateChange('sowingDate', date)}
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                    <IconButton onClick={() => handleClearDate('sowingDate')} sx={{ ml: 2 }}>
                        <ClearIcon />
                    </IconButton>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{
                '&.Mui-expanded': {
                    margin: 0,
                    borderColor: 'inherit', // Bu satır border renginin korunmasını sağlar
                    borderTop:'1px solid',
                    borderTopColor:'rgba(0, 0, 0, 0.12)',
                    borderBottom: '1px solid', // Alt border çizgisini yeniden tanımlar
                    borderBottomColor: 'rgba(0, 0, 0, 0.12)' // İsteğe bağlı olarak alt border rengi
                }
            }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{
                '&.Mui-expanded': {
                    margin: 0,
                    borderColor: 'inherit', // Bu satır border renginin korunmasını sağlar
                    borderBottom: '1px solid', // Alt border çizgisini yeniden tanımlar
                    borderBottomColor: 'rgba(0, 0, 0, 0.12)' // İsteğe bağlı olarak alt border rengi
                }
            }}>
                    <Typography>Hasat Tarihi</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ display: 'flex', alignItems: 'center' }}>
                    <DatePicker
                        label="Hasat Tarihi"
                        value={filter.harvestDate}
                        onChange={(date) => handleDateChange('harvestDate', date)}
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                    <IconButton onClick={() => handleClearDate('harvestDate')} sx={{ ml: 2 }}>
                        <ClearIcon />
                    </IconButton>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{
                '&.Mui-expanded': {
                    margin: 0,
                    borderColor: 'inherit', // Bu satır border renginin korunmasını sağlar
                    borderTop:'1px solid',
                    borderTopColor:'rgba(0, 0, 0, 0.12)',
                    borderBottom: '1px solid', // Alt border çizgisini yeniden tanımlar
                    borderBottomColor: 'rgba(0, 0, 0, 0.12)' // İsteğe bağlı olarak alt border rengi
                }
            }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{
                    '&.Mui-expanded': {
                        margin: 0,
                        borderColor: 'inherit', // Bu satır border renginin korunmasını sağlar
                        borderBottom: '1px solid', // Alt border çizgisini yeniden tanımlar
                        borderBottomColor: 'rgba(0, 0, 0, 0.12)' // İsteğe bağlı olarak alt border rengi
                    }
                }}>
                    <Typography>Hasat Durumu</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ borderTop:"2px solid #ff6305"}}>
                    <TextField
                        select
                        variant="outlined"
                        fullWidth
                        name="harvestCondition"
                        value={filter.harvestCondition}
                        onChange={handleFilterChange}
                        placeholder="Hasat Durumu"
                    >
                        {qualityOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{
                '&.Mui-expanded': {
                    margin: 0,
                    borderColor: 'inherit', // Bu satır border renginin korunmasını sağlar
                    borderTop:'2px solid',
                    borderTopColor:'rgba(0, 0, 0, 0.12)',
                    borderBottom: '1px solid', // Alt border çizgisini yeniden tanımlar
                    borderBottomColor: 'rgba(0, 0, 0, 0.12)' // İsteğe bağlı olarak alt border rengi
                }
            }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Ürün Kalitesi</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ borderTop:"2px solid #ff6305"}}>
                    <TextField
                        select
                        variant="outlined"
                        fullWidth
                        name="productQuality"
                        value={filter.productQuality}
                        onChange={handleFilterChange}
                        placeholder="Ürün Kalitesi"
                    >
                        {qualityOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{
                '&.Mui-expanded': {
                    margin: 0,
                    borderColor: 'inherit',
                    borderTop:'1px solid',
                    borderTopColor:'rgba(0, 0, 0, 0.12)',
                    borderBottom: '1px solid',
                    borderBottomColor: 'rgba(0, 0, 0, 0.12)'
                }
            }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Ürün Miktarı</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        name="productQuantityMin"
                        value={filter.productQuantityMin}
                        onChange={handleFilterChange}
                        placeholder="Min Miktar"
                        label="Min Miktar"
                        type="number"
                    />
                    <TextField
                        variant="outlined"
                        fullWidth
                        name="productQuantityMax"
                        value={filter.productQuantityMax}
                        onChange={handleFilterChange}
                        placeholder="Max Miktar"
                        label="Max Miktar"
                        type="number"
                    />
                </AccordionDetails>
            </Accordion>
        </Paper>
    );

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Container maxWidth="xl">
                    <Box>
                        <BreadcrumbComponent pageName="Değerlendirmelerim"/>
                    </Box>
                    <Box sx={{ mt: 3, display: 'flex', flexDirection: isLargeScreen ? 'row' : 'column' }}>
                        {isLargeScreen && (
                            <Box sx={{ width: '25%', mr: 3 }}>
                                {renderFilters()}
                            </Box>
                        )}
                        <Box sx={{ width: isLargeScreen ? '75%' : '100%' }}>
                            {!isLargeScreen && renderFilters()}
                            <Grid container spacing={3}>
                                {filteredEvaluations.map((evaluation, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={evaluation.id ? `evaluation-${evaluation.id}` : `evaluation-${index}`}>
                                        <Card>
                                            {imageLoading[evaluation.id] !== false && (
                                                <Skeleton variant="rectangular" height={140} />
                                            )}
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={evaluation.landImageUrl}
                                                alt="Arazi Resmi"
                                                sx={{ display: imageLoading[evaluation.id] === false ? 'block' : 'none' }}
                                                onLoad={() => handleImageLoad(evaluation.id)}
                                                onError={() => handleImageError(evaluation.id)}
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {evaluation.landName}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Bitki: {evaluation.plantName}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Ekim Tarihi: {evaluation.sowingDate}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Hasat Tarihi: {evaluation.harvestDate}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Hasat Durumu: {evaluation.harvestCondition}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Ürün Kalitesi: {evaluation.productQuality}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Ürün Miktarı: {evaluation.productQuantity}
                                                </Typography>
                                                <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}
                                                        onClick={() => handleDetail(evaluation.id)}>
                                                    Detay
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                        </Box>
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
            </LocalizationProvider>
        </ThemeProvider>
    );
};

export default EvaluationList;
