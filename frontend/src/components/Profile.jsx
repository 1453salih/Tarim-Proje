// ProfilePage.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Box, Grid, Paper, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Backend API'den veri çeken fonksiyon
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/api/user/{id}`); // API endpoint
                setUser(response.data); // Veriyi state'e kaydet
                setLoading(false); // Yüklenme tamamlandı
            } catch (err) {
                setError('Veri alınırken hata oluştu.'); // Hata varsa set et
                setLoading(false); // Yüklenme tamamlandı
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <Container maxWidth="md">
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md">
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    if (!user) {
        return null; // Eğer veri yoksa hiçbir şey gösterme
    }

    return (
        <Container maxWidth="md">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h4" gutterBottom>
                    Profil Sayfası
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="İsim"
                            variant="outlined"
                            value={user.name}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Soyisim"
                            variant="outlined"
                            value={user.surName}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            value={user.email}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Telefon"
                            variant="outlined"
                            value={user.phone}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Adres"
                            variant="outlined"
                            value={user.address}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Şehir"
                            variant="outlined"
                            value={user.locality.city}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Ülke"
                            variant="outlined"
                            value={user.locality.country}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Araziler:
                        </Typography>
                        <Box>
                            {user.lands.map((land) => (
                                <Typography key={land.id}>
                                    {land.name} - {land.size}
                                </Typography>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
                <Box mt={3}>
                    <Button variant="contained" color="primary">
                        Profili Güncelle
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default ProfilePage;
