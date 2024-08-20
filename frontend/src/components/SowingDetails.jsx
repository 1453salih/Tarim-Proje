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
    TextField, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import RecommendationsTable from "./RecommendationsTable";

const SowingDetails = () => {
    const {id} = useParams();
    const [sowing, setSowing] = useState(null);
    const [landId, setLandId] = useState('');
    const [plantId, setPlantId] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [plants, setPlants] = useState([]);
    const [lands, setLands] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [sowingType, setSowingType] = useState('');

    const navigate = useNavigate();

    // Kategorileri, bitkileri ve arazileri çekmek için kullanılan useEffect hookları
    useEffect(() => {
        if (plantId) {
            const fetchPlantCategoryDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/categories/by-plant/${plantId}`, {withCredentials: true});
                    const plantCategory = response.data;
                    console.log(plantCategory);
                    setSelectedCategory(plantCategory.id); // Kategori bilgisini set et
                } catch (error) {
                    console.error("Error Fetching Plant Details", error);
                }
            };
            fetchPlantCategoryDetails();
        }
    }, [plantId]);

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
        if (selectedCategory) {
            const fetchPlantsByCategory = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/plants/by-category?categoryId=${selectedCategory}`, {withCredentials: true});
                    setPlants(response.data);
                } catch (error) {
                    console.error("Error Fetching Plants", error);
                }
            };
            fetchPlantsByCategory();
        }
    }, [selectedCategory]);

    useEffect(() => {
        const fetchPlantsAndLands = async () => {
            try {
                const [plantsResponse, landsResponse] = await Promise.all([
                    axios.get('http://localhost:8080/plants', {withCredentials: true}),
                    axios.get('http://localhost:8080/lands', {withCredentials: true})
                ]);
                setPlants(plantsResponse.data);
                setLands(landsResponse.data);
            } catch (error) {
                console.error('Error fetching plants and lands:', error);
            }
        };
        fetchPlantsAndLands();
    }, []);

    // Ekim detaylarını ve önerileri çekmek için kullanılan useEffect hookları
    useEffect(() => {
        axios.get(`http://localhost:8080/sowings/detail/${id}`, {withCredentials: true})
            .then(response => {
                setSowing(response.data);
                setLandId(response.data.landId);
                setPlantId(response.data.plantId);
                setSelectedCategory(response.data.categoryId);
                setSowingType(response.data.sowingType); // Sowing Type burada set ediliyor
            })
            .catch(error => console.error('Error fetching sowing details:', error));
    }, [id]);

    // Kaydetme ve silme işlemleri için kullanılan fonksiyonlar
    const handleSave = async () => {
        if (!plantId || !sowing.sowingDate || !landId || !sowing.sowingField || !sowingType) {
            setSnackbarMessage('Please fill in all the fields.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        const updatedSowing = {
            ...sowing,
            plantId: parseInt(plantId),
            landId: parseInt(landId),
            sowingType: sowingType // sowingType güncellenmiş olarak dahil ediliyor
        };

        try {
            const response = await axios.put(`http://localhost:8080/sowings/update/${id}`, updatedSowing, {withCredentials: true});
            if (response.status === 200) {
                setSnackbarMessage('Sowing updated successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                setTimeout(() => navigate('/sowing-list'), 3000);
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
            const response = await axios.delete(`http://localhost:8080/sowings/delete/${id}`, {withCredentials: true});
            if (response.status === 200) {
                setSnackbar({open: true, message: 'Sowing deleted successfully!', severity: 'success'});
                setTimeout(() => navigate('/sowing-list'), 3000);
            } else {
                setSnackbar({open: true, message: 'Failed to delete the Sowing.', severity: 'error'});
            }
        } catch (error) {
            setSnackbar({open: true, message: 'Error: ' + error.message, severity: 'error'});
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
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

    if (!sowing) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="lg">
            <BreadcrumbComponent pageName="Ekimlerim"/>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Box sx={{mt: 3}}>
                        <Typography variant="h4" component="h2" gutterBottom>
                            {isEditing ? 'Ekim Bilgilerini Düzenle' : `${sowing.landName} - ${sowing.plantName} Detayları`}
                        </Typography>
                        <Paper elevation={3} sx={{p: 2}}>
                            {isEditing ? (
                                <>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Kategori</InputLabel>
                                        <Select
                                            label="Kategori"
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                        >
                                            {categories.length > 0 ? (
                                                categories.map((category) => (
                                                    <MenuItem key={category.id} value={category.id}>
                                                        {category.categoryName}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem disabled>
                                                    Not Found
                                                </MenuItem>
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
                                        <InputLabel>Land Type</InputLabel>
                                        <Select
                                            label="Land Type"
                                            value={sowingType}
                                            onChange={(e) => {
                                                console.log("Selected Sowing Type: ", e.target.value); // Konsola seçilen değeri yazdırır
                                                setSowingType(e.target.value);
                                            }}
                                        >
                                            <MenuItem value="Tarla" key="Tarla">Tarla</MenuItem>
                                            <MenuItem value="Bağ" key="Bağ">Bağ</MenuItem>
                                            <MenuItem value="Bahçe" key="Bahçe">Bahçe</MenuItem>
                                            <MenuItem value="Zeytinlik" key="Zeytinlik">Zeytinlik</MenuItem>
                                            <MenuItem value="Çayır" key="Çayır">Çayır</MenuItem>
                                            <MenuItem value="Mera" key="Mera">Mera</MenuItem>
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
                                </>
                            ) : (
                                <>
                                    <Typography variant="h6">Ekim Alanı: {sowing.sowingField} m²</Typography>
                                    <Typography variant="h6">Ekim Türü: {sowing.sowingType}</Typography>
                                    <Typography variant="h6">Bitki: {sowing.plantName}</Typography>
                                    <Typography variant="h6">Arazi: {sowing.landName}</Typography>
                                    <Typography variant="h6">Ekim Tarihi: {sowing.sowingDate}</Typography>
                                </>
                            )}
                        </Paper>
                        <Box sx={{marginTop: 3}}>
                            {isEditing ? (
                                <>
                                    <Button variant="contained" color="primary" onClick={handleSave}>
                                        Kaydet
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={handleEditToggle}
                                            sx={{marginLeft: 2}}>
                                        İptal
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="contained" color="primary" onClick={handleEditToggle}>
                                        Düzenle
                                    </Button>
                                    <Button variant="contained" color="error" onClick={handleOpenDeleteDialog}
                                            sx={{marginLeft: 2}}>
                                        Sil
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Box>
                </Grid>
                {isEditing ? (
                    <RecommendationsTable landId={landId} />
                ) : null}

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
    );
};

export default SowingDetails;
