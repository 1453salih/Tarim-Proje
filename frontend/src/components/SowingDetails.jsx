import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BreadcrumbComponent from "./BreadCrumb.jsx";
import {
    Alert,
    Button,
    Container,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl, InputAdornment, InputLabel, MenuItem,
    Paper, Select,
    Snackbar,
    TextField, Grid
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import RecommendationsTable from "./RecommendationsTable";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import '@fontsource/poppins';

const theme = createTheme({
    typography: {
        fontFamily: 'Poppins, sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontFamily: 'Poppins, sans-serif',
                    textTransform: 'none',
                }
            },
        },
    },
});
const SowingDetails = () => {
    const {id} = useParams();
    const [sowing, setSowing] = useState(null);
    const [landId, setLandId] = useState('');
    const [plantId, setPlantId] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [plants, setPlants] = useState([]);
    const [lands, setLands] = useState([]);
    const [landType, setLandType] = useState('');
    const [initialSowingField, setInitialSowingField] = useState(0);

    const navigate = useNavigate();

    // Kategorileri, bitkileri ve arazileri çekmek için useEffect hookları
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/categories', {withCredentials: true});
                setCategories(response.data);
            } catch (error) {
                console.error("Error Fetching Categories", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchPlantsAndLands = async () => {
            try {
                const [plantsResponse, landsResponse] = await Promise.all([
                    axios.get('http://localhost:8080/plants', { withCredentials: true }),
                    axios.get('http://localhost:8080/lands', { withCredentials: true })
                ]);
                setPlants(plantsResponse.data);
                setLands(landsResponse.data.content);  // content dizisini alıyoruz
            } catch (error) {
                console.error('Bitki ve arazi verileri çekilirken hata oluştu:', error);
            }
        };
        fetchPlantsAndLands();
    }, []);


    // Seçilen bitkinin kategori bilgisini getir ve kategori dropdown'ına ata
    useEffect(() => {
        axios.get(`http://localhost:8080/sowings/detail/${id}`, {withCredentials: true})
            .then(response => {
                setSowing(response.data);
                setLandId(response.data.landId);
                setPlantId(response.data.plantId);
                setLandType(response.data.landType);

                // Sayfa açıldığında gelen ekim alanı kaydediliyor
                setInitialSowingField(parseFloat(response.data.sowingField));

                return axios.get(`http://localhost:8080/categories/by-plant/${response.data.plantId}`, {withCredentials: true});
            })
            .then(categoryResponse => {
                setSelectedCategory(categoryResponse.data.id);
            })
            .catch(error => console.error('Error fetching sowing details:', error));
    }, [id]);

    const handleSave = async () => {
        if (!plantId || !sowing.sowingDate || !landId || !sowing.sowingField || !landType) {
            setSnackbarMessage('Please fill in all the fields.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        const selectedLand = lands.find(land => land.id === parseInt(landId));

        // İlk gelen ekim alanı ile ekilebilir alan toplanıyor.
        const totalSowingField = initialSowingField;
        const totalLandField = parseFloat(selectedLand.clayableLand);
        const updateLimit = totalSowingField+totalLandField
        // Eğer yazılan değer önceki değer + ekilebilir alan değerinden büyükse ekim yapılamaz.
        if (selectedLand && sowing.sowingField > updateLimit) {
            setSnackbarMessage(`Ekim alanı (${totalSowingField} m²) ekilebilir araziden daha büyük olamaz (${updateLimit} m²).`);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }else{
            console.log("Program kafayı yedi.")
        }

        const updatedSowing = {
            ...sowing,
            plantId: parseInt(plantId),
            landId: parseInt(landId),
            landType: landType
        };

        try {
            const response = await axios.put(`http://localhost:8080/sowings/update/${id}`, updatedSowing, {withCredentials: true});
            if (response.status === 200) {
                setSnackbarMessage('Ekim başarıyla güncellendi!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                setTimeout(() => navigate('/sowing-list'), 500);
            } else {
                setSnackbarMessage('Failed to update the Sowing.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage('Error: ' + error.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:8080/sowings/delete/${id}`, { withCredentials: true });
            if (response.status === 200 || response.status === 204) {
                setSnackbarMessage('Ekim başarıyla silindi!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);

                // Modalı kapat
                handleCloseDeleteDialog();

                setTimeout(() => navigate('/sowing-list'), 500);
            } else {
                setSnackbarMessage('Ekim silinemedi.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage('Hata: ' + error.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };


    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setSowing(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        navigate('/sowing-list');  // İptal işlemi.
    };

    if (!sowing) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <ThemeProvider theme={theme}>


            <Container maxWidth="lg">
                <BreadcrumbComponent pageName="Ekim Güncelle"/>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Paper elevation={3} sx={{p: 2}}>
                                <Typography variant="h4" component="h2" gutterBottom>
                                    Ekim Bilgilerini Düzenle
                                </Typography>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Kategori</InputLabel>
                                    <Select
                                        label="Kategori"
                                        value={selectedCategory}  // Doğru kategori burada gösteriliyor
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        {categories.length > 0 ? (
                                            categories.map((category) => (
                                                <MenuItem key={category.id} value={category.id}>
                                                    {category.categoryName}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>Not Found</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Bitki</InputLabel>
                                    <Select
                                        label="Bitki"
                                        value={plantId}
                                        onChange={(e) => setPlantId(e.target.value)}
                                        disabled={!selectedCategory}
                                    >
                                        {plants.map((plant) => (
                                            <MenuItem key={plant.id} value={plant.id}>{plant.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Arazi</InputLabel>
                                    <Select
                                        label="Arazi"
                                        value={landId}
                                        onChange={(e) => setLandId(e.target.value)}
                                    >
                                        {lands.map((land) => (
                                            <MenuItem key={land.id} value={land.id}>{land.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Arazi Tipi</InputLabel>
                                    <Select
                                        label="Land Type"
                                        value={landType}
                                        onChange={(e) => setLandType(e.target.value)}
                                    >
                                        <MenuItem value="Tarla">Tarla</MenuItem>
                                        <MenuItem value="Bağ">Bağ</MenuItem>
                                        <MenuItem value="Bahçe">Bahçe</MenuItem>
                                        <MenuItem value="Zeytinlik">Zeytinlik</MenuItem>
                                        <MenuItem value="Çayır">Çayır</MenuItem>
                                        <MenuItem value="Mera">Mera</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="Ekim Alanı"
                                    name="sowingField"
                                    value={sowing.sowingField}
                                    onChange={handleChange}
                                    margin="normal"
                                    type="number"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                                    }}
                                    inputProps={{min: 0}}
                                />
                                <TextField
                                    fullWidth
                                    label="Ekim Tarihi"
                                    name="sowingDate"
                                    value={sowing.sowingDate}
                                    onChange={handleChange}
                                    margin="normal"
                                    type="date"
                                    InputLabelProps={{shrink: true}}
                                />
                                <Grid container spacing={2} sx={{marginTop: 3}}>
                                    <Grid item xs={6}>
                                        <Box sx={{textAlign: 'left'}}>
                                            <Button variant="contained" color="primary" onClick={handleSave}>
                                                Kaydet
                                            </Button>
                                            <Button variant="contained" color="error" onClick={handleOpenDeleteDialog}
                                                    sx={{marginLeft: 2}}>
                                                Sil
                                            </Button>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{textAlign: 'right'}}>
                                            <Button variant="contained" color="inherit" onClick={handleCancel}>
                                                İptal
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>

                            </Paper>

                        </Box>
                    </Grid>

                    <RecommendationsTable landId={landId}/>

                </Grid>

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{width: '100%'}}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

                <Dialog
                    open={openDeleteDialog}
                    onClose={handleCloseDeleteDialog}
                    aria-labelledby="delete-dialog-title"
                    aria-describedby="delete-dialog-description"
                >
                    <DialogTitle id="delete-dialog-title">Silmek istediğinizden emin misiniz?</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="delete-dialog-description">
                            Bu işlem geri alınamaz. Silmek istediğinizden emin misiniz?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteDialog} color="primary">
                            İptal
                        </Button>
                        <Button onClick={handleDelete} color="error" autoFocus>
                            Sil
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ThemeProvider>
    );
};

export default SowingDetails;
