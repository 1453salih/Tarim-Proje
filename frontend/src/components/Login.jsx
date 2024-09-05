import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Link, Grid, Box, Typography, Container, Paper, FormControlLabel, Checkbox, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import Spinner from '../Spinner/Spinner'; // Spinner bileşenini import ediyoruz

const theme = createTheme();

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);  // Başlangıçta loading false
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);  // Giriş işlemi başladığında loading true
        try {
            const response = await axios.post('http://localhost:8080/auth/login', { email, password }, { withCredentials: true });
            if (response.status === 200) {
                const data = response.data;
                localStorage.setItem('userId', data.userId);
                setError('');
                setIsLoggedIn(true);
                navigate('/home');
            } else {
                setError('Invalid credentials');
            }
        } catch (error) {
            setError('An error occurred');
            console.error('Error:', error);
        } finally {
            setLoading(false);  // Giriş işlemi tamamlandığında loading false
        }
    };

    return (
        <ThemeProvider theme={theme}>
            {loading ? (  // Eğer loading true ise spinner göster
                <Spinner />
            ) : (  // Eğer loading false ise form göster
                <Container component="main" maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Paper elevation={6} sx={{ display: 'flex', borderRadius: 2, overflow: 'hidden', width: '100%' }}>
                        <Box
                            sx={{
                                width: '45%',
                                backgroundImage: 'url(../src/assets/loginCard1.png)', // Sol tarafta gösterilecek fotoğrafın yolu
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundColor: green[500],
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                padding: 3,
                            }}
                        >
                        </Box>
                        <Box
                            sx={{
                                width: { xs: '100%', md: '55%' },
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 4,
                                backgroundColor: '#fff',
                            }}
                        >
                            <Typography component="h1" variant="h5" sx={{ color: '#1c7946', fontWeight: 'bold', mb: 1 }}>
                                Ekim Rehberi
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'gray', mb: 3 }}>
                                Hesabınızla Giriş Yapın
                            </Typography>
                            <Box
                                component="form"
                                onSubmit={handleLogin}
                                noValidate
                                sx={{ mt: 1 }}
                            >
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="E-posta Adresiniz"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Şifrenizi Giriniz"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    sx={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
                                />
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Beni Hatırla"
                                    sx={{ mb: 2 }}
                                />
                                <Box sx={{ minHeight: '24px', mb: 2 }}>
                                    {error && (
                                        <Typography variant="body2" color="error" align="center">
                                            {error}
                                        </Typography>
                                    )}
                                </Box>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 1, mb: 1, backgroundColor: '#1c7946', borderRadius: '8px' }}
                                >
                                    Giriş Yap
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    sx={{ mt: 1, mb: 2, borderRadius: '8px' }}
                                >
                                    Google ile Giriş Yap
                                </Button>
                                <Grid container>
                                    <Grid item xs>
                                        <Link href="#" variant="body2" sx={{ color: 'gray' }}>
                                            Şifremi Unuttum
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                                            Üye değil misiniz?{' '}
                                            <Link href="/signup" variant="body2" sx={{ color: '#1c7946' }}>
                                                Buradan kayıt olun.
                                            </Link>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            )}
        </ThemeProvider>
    );
}

export default Login;
