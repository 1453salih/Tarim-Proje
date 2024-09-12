import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Paper, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';

const theme = createTheme();

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/signup', { email, password });

            if (response.status === 200) {
                const { userId } = response.data;
                localStorage.setItem('userId', userId);

                setMessage('Kayıt başarılı. Ana sayfaya yönlendiriliyorsunuz...');
                setTimeout(() => {
                    navigate('/home');
                }, 2000);
            } else {
                setError('Kayıt başarısız. Lütfen tekrar deneyin.');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Bir hata oluştu');
            }
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Paper elevation={6} sx={{ display: 'flex', borderRadius: 2, overflow: 'hidden', width: '100%', height:"57%" }}>
                    <Box
                        sx={{
                            width: '45%',
                            backgroundImage: 'url(../src/assets/login.png)', // Sol tarafta gösterilecek fotoğrafın yolu
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundColor: '#1c7946',
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
                            Hesabınızı Oluşturun
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSignup}
                            noValidate
                            sx={{ mt: 1 }}
                        >
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Adresiniz"
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
                            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                            {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, mb: 2, backgroundColor: '#1c7946', borderRadius: '8px' }}
                            >
                                Kayıt Ol
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

export default Signup;
