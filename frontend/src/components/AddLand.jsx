import React, {useState, useEffect} from 'react';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Snackbar,
    Alert,
    Paper
} from '@mui/material';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import BreadcrumbComponent from "./BreadCrumb.jsx";
import ImageUploader from "./ImageUploader.jsx";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import '@fontsource/poppins';

const tema = createTheme({
    typography: {
        fontFamily: 'Poppins, sans-serif',
    },
});

function AraziEkle() {
    const [araziAdi, setAraziAdi] = useState('');
    const [araziBoyutu, setAraziBoyutu] = useState('');
    const [secilenIl, setSecilenIl] = useState('');
    const [secilenIlce, setSecilenIlce] = useState('');
    const [secilenKoy, setSecilenKoy] = useState('');
    const [resimUrl, setResimUrl] = useState('');
    const [acikSnackbar, setAcikSnackbar] = useState(false);
    const [snackbarMesaji, setSnackbarMesaji] = useState('');
    const [snackbarCiddiyeti, setSnackbarCiddiyeti] = useState('success');
    const [sehirler, setSehirler] = useState([]);
    const [ilceler, setIlceler] = useState([]);
    const [koyler, setKoyler] = useState([]);

    const navigate = useNavigate();
    const [araziTuru, setAraziTuru] = useState('');
    const [araziTuruHata, setAraziTuruHata] = useState(false);
    const [araziAdiHata, setAraziAdiHata] = useState(false);
    const [araziBoyutuHata, setAraziBoyutuHata] = useState(false);
    const [secilenIlHata, setSecilenIlHata] = useState(false);
    const [secilenIlceHata, setSecilenIlceHata] = useState(false);
    const [secilenKoyHata, setSecilenKoyHata] = useState(false);

    useEffect(() => {
        const sehirleriGetir = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/locations/cities');
                setSehirler(response.data);
            } catch (error) {
                console.error("Şehirler alınırken hata oluştu:", error);
            }
        };

        sehirleriGetir();
    }, []);

    useEffect(() => {
        if (secilenIl) {
            const ilceleriGetir = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/locations/districts/${secilenIl}`);
                    setIlceler(response.data);
                    setSecilenIlce('');
                    setKoyler([]);
                    setSecilenKoy('');
                } catch (error) {
                    console.error("İlçeler alınırken hata oluştu:", error);
                }
            };

            ilceleriGetir();
        }
    }, [secilenIl]);

    useEffect(() => {
        if (secilenIlce) {
            const koyleriGetir = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/locations/localities/${secilenIlce}`);
                    setKoyler(response.data);
                    setSecilenKoy('');
                } catch (error) {
                    console.error("Köyler alınırken hata oluştu:", error);
                }
            };

            koyleriGetir();
        } else {
            setKoyler([]);
        }
    }, [secilenIlce]);

    const araziEkle = async (e) => {
        e.preventDefault();

        console.log("Formdan gönderilen arazi türü:", araziTuru);
        let hataVarMi = false;

        if (!araziAdi) setAraziAdiHata(true), hataVarMi = true;
        else setAraziAdiHata(false);

        if (!araziBoyutu) setAraziBoyutuHata(true), hataVarMi = true;
        else setAraziBoyutuHata(false);

        if (!secilenIl) setSecilenIlHata(true), hataVarMi = true;
        else setSecilenIlHata(false);

        if (!secilenIlce) setSecilenIlceHata(true), hataVarMi = true;
        else setSecilenIlceHata(false);

        if (!secilenKoy) setSecilenKoyHata(true), hataVarMi = true;
        else setSecilenKoyHata(false);

        if (!araziTuru) {
            setAraziTuruHata(true);
            hataVarMi = true;
        } else {
            setAraziTuruHata(false);
        }

        if (hataVarMi) {
            setSnackbarMesaji('Lütfen tüm alanları doldurun.');
            setSnackbarCiddiyeti('error');
            setAcikSnackbar(true);
            return;
        }

        const kullaniciId = localStorage.getItem('userId');
        if (!kullaniciId) {
            setSnackbarMesaji('Kullanıcı oturumu açık değil.');
            setSnackbarCiddiyeti('error');
            setAcikSnackbar(true);
            return;
        }

        const araziVerisi = {
            name: araziAdi,
            landSize: parseInt(araziBoyutu),
            localityId: secilenKoy,
            userId: parseInt(kullaniciId),
            landType: araziTuru
        };

        const formData = new FormData();
        formData.append('land', new Blob([JSON.stringify(araziVerisi)], {type: "application/json"}));
        formData.append('file', resimUrl);

        try {
            const response = await axios.post('http://localhost:8080/lands', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (response.status === 201) {
                setSnackbarMesaji('Arazi başarıyla kaydedildi!');
                setSnackbarCiddiyeti('success');
                setAcikSnackbar(true);
                setTimeout(() => navigate('/land-list'), 3000);
                setAraziAdi('');
                setAraziBoyutu('');
                setAraziTuru('');
                setSecilenIl('');
                setSecilenIlce('');
                setSecilenKoy('');
                setResimUrl('');
            } else {
                setSnackbarMesaji('Arazi kaydedilemedi.');
                setSnackbarCiddiyeti('error');
                setAcikSnackbar(true);
            }
        } catch (error) {
            setSnackbarMesaji('Hata: ' + error.message);
            setSnackbarCiddiyeti('error');
            setAcikSnackbar(true);
        }
    };


    const handleCloseSnackbar = () => {
        setAcikSnackbar(false);
    };

    const handleCancel = () => {
        navigate('/home');  // İptal işlemi.
    };

    return (
        <ThemeProvider theme={tema}>

            <Container maxWidth="sm" sx={{mb:5}}>
                <Box>
                    <BreadcrumbComponent pageName="Arazi Ekle"/>
                </Box>
                <Paper component="form" onSubmit={araziEkle} sx={{mt: 3, p: 3}}>
                    <Typography variant="h4" component="h2" gutterBottom>
                        Arazi Ekle
                    </Typography>
                    <TextField
                        fullWidth
                        label="Arazi Adı"
                        variant="outlined"
                        margin="normal"
                        value={araziAdi}
                        onChange={(e) => {
                            setAraziAdi(e.target.value);
                            if (e.target.value) setAraziAdiHata(false);
                        }}
                        error={araziAdiHata}
                        helperText={araziAdiHata ? "Arazi adı gereklidir." : ""}
                    />

                    <TextField
                        fullWidth
                        label="Arazi Boyutu (m²)"
                        variant="outlined"
                        margin="normal"
                        value={araziBoyutu}
                        onChange={(e) => {
                            setAraziBoyutu(e.target.value);
                            if (e.target.value) setAraziBoyutuHata(false);
                        }}
                        error={araziBoyutuHata}
                        helperText={araziBoyutuHata ? "Arazi boyutu gereklidir." : ""}
                    />
                    <FormControl fullWidth margin="normal" error={araziTuruHata}>
                        <InputLabel>Arazi Türü</InputLabel>
                        <Select
                            label="Arazi Türü"
                            value={araziTuru}
                            onChange={(e) => {
                                setAraziTuru(e.target.value);
                            }}
                        >
                            <MenuItem value="Tarla" key="Tarla">Tarla</MenuItem>
                            <MenuItem value="Bağ" key="Bağ">Bağ</MenuItem>
                            <MenuItem value="Bahçe" key="Bahçe">Bahçe</MenuItem>
                            <MenuItem value="Zeytinlik" key="Zeytinlik">Zeytinlik</MenuItem>
                            <MenuItem value="Çayır" key="Çayır">Çayır</MenuItem>
                            <MenuItem value="Mera" key="Mera">Mera</MenuItem>
                        </Select>
                        {araziTuruHata && <Typography color="error">Lütfen arazi türünü seçiniz.</Typography>}
                    </FormControl>
                    <FormControl fullWidth margin="normal" error={secilenIlHata}>
                        <InputLabel>Şehir</InputLabel>
                        <Select
                            value={secilenIl}
                            onChange={(e) => {
                                setSecilenIl(e.target.value);
                                if (e.target.value) setSecilenIlHata(false);
                            }}
                        >
                            {sehirler.map(sehir => (
                                <MenuItem key={sehir.code} value={sehir.code}>{sehir.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal" error={secilenIlceHata} disabled={!secilenIl}>
                        <InputLabel>İlçe</InputLabel>
                        <Select
                            value={secilenIlce}
                            onChange={(e) => {
                                setSecilenIlce(e.target.value);
                                if (e.target.value) setSecilenIlceHata(false);
                            }}
                        >
                            {ilceler.map(ilce => (
                                <MenuItem key={ilce.code} value={ilce.code}>{ilce.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal" error={secilenKoyHata}
                                 disabled={!secilenIlce || koyler.length === 0}>
                        <InputLabel>Köy/Mahalle</InputLabel>
                        <Select
                            value={secilenKoy}
                            onChange={(e) => {
                                setSecilenKoy(e.target.value);
                                if (e.target.value) setSecilenKoyHata(false);
                            }}
                        >
                            {koyler.map(koy => (
                                <MenuItem key={koy.code} value={koy.code}>{koy.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <ImageUploader onImageUpload={setResimUrl}/>

                    <Button type="submit" variant="contained" fullWidth sx={{
                        mt: 2, backgroundColor: "#ff8a00",
                        '&:hover': {
                            backgroundColor: '#ff7a00',
                        }
                    }}>
                        Arazi Ekle
                    </Button>
                    <Button type="submit" variant="contained" fullWidth onClick={handleCancel} sx={{
                        mt: 2, backgroundColor: "#ff0008",
                        '&:hover': {
                            backgroundColor: '#ff0008',
                        }
                    }}>
                        İptal
                    </Button>
                </Paper>

                <Snackbar
                    open={acikSnackbar}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbarCiddiyeti} sx={{width: '100%'}}>
                        {snackbarMesaji}
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
}

export default AraziEkle;
