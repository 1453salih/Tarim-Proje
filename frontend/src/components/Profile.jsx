import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Link, Grid, Box, Typography, Container, Paper, FormControlLabel, Checkbox, Button, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import Spinner from '../Spinner/Spinner';

const theme = createTheme();

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' }); // Uyarılar için mesaj nesnesi
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // Form doğrulamaları
        if (!email || !password) {
            setMessage({ text: 'Lütfen tüm alanları doldurun.', type: 'error' });
            return;
        }

        if (!validateEmail(email)) {
            setMessage({ text: 'Geçerli bir e-posta adresi giriniz.', type: 'error' });
            return;
        }

        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await axios.post('http://localhost:8080/auth/login', { email, password }, { withCredentials: true });
            if (response.status === 200) {
                const data = response.data;
                localStorage.setItem('userId', data.userId);
                setIsLoggedIn(true);
                navigate('/home');
            } else {
                setMessage({ text: 'Geçersiz kimlik bilgileri.', type: 'error' });
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setMessage({ text: error.response.data.message, type: 'error' });
            } else {
                setMessage({ text: 'Kullanıcı adı veya şifre hatalı', type: 'error' });
            }
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            {loading ? (
                <Spinner />
            ) : (
                <Container component="main" maxWidth="lg" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Paper
                        elevation={0}
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            borderRadius: 2,
                            overflow: 'hidden',
                            width: '100%',
                            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.15)'
                        }}
                    >
                        <Box
                            sx={{
                                width: { xs: '100%', md: '60%' },
                                height: { xs: '200px', md: 'auto' },
                                backgroundImage: 'url(../src/assets/login.png)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundColor: green[500],
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                padding: 3
                            }}
                        >
                        </Box>
                        <Box
                            sx={{
                                width: { xs: '100%', md: '40%' },
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: { xs: 2, md: 4 },
                                backgroundColor: '#fff'
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
                                sx={{ width: '100%', mt: 1 }}
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
                                    sx={{ backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
                                    error={message.type === 'error' && !validateEmail(email)}
                                    helperText={message.type === 'error' && !validateEmail(email) ? 'Geçerli bir e-posta adresi giriniz.' : ''}
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
                                    sx={{ backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
                                    error={message.type === 'error' && password.length < 6}
                                    helperText={message.type === 'error' && password.length < 6 ? 'Şifre en az 6 karakter olmalıdır.' : ''}
                                />
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Beni Hatırla"
                                    sx={{ mb: 2 }}
                                />
                                {message.text && (
                                    <Alert severity={message.type} sx={{ width: '100%', mb: 2 }}>
                                        {message.text}
                                    </Alert>
                                )}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        mt: 1,
                                        mb: 1,
                                        backgroundColor: '#1c7946',
                                        borderRadius: '8px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                        '&:hover': {
                                            backgroundColor: '#145c35',
                                            boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.15)'
                                        }
                                    }}
                                >
                                    Giriş Yap
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    sx={{
                                        mt: 1,
                                        mb: 2,
                                        borderRadius: '8px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)'
                                    }}
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
