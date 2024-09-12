import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {
    TextField,
    Link,
    Grid,
    Box,
    Typography,
    Container,
    Paper,
    FormControlLabel,
    Checkbox,
    Button,
    Alert
} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {green} from '@mui/material/colors';
import Spinner from '../Spinner/Spinner';
import LoginWithGoogle from "./Buttons/LoginWithGoogle.jsx";
import SquareButton from "./Buttons/Button.jsx";
import '@fontsource/poppins';
import {typography} from "@mui/system";

const theme = createTheme({
    typography: {
        fontFamily: 'Poppins, sans-serif',
    },
});

function Login({setIsLoggedIn}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Lütfen tüm alanları doldurun.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Geçerli bir e-posta adresi giriniz.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                email,
                password
            }, {withCredentials: true});
            if (response.status === 200) {
                const data = response.data;
                localStorage.setItem('userId', data.userId);
                setIsLoggedIn(true);
                navigate('/home');
            } else {
                setError('Geçersiz kimlik bilgileri.');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Kullanıcı adı veya şifre hatalı');
            }
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            {loading ? (
                <Spinner/>
            ) : (
                <Container component="main" maxWidth="lg"
                           sx={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Paper elevation={6} sx={{
                        display: 'flex',
                        flexDirection: {xs: 'column', md: 'row'},
                        borderRadius: 2,
                        overflow: 'hidden',
                        width: '100%'
                    }}>
                        <Box
                            sx={{
                                width: {xs: '100%', md: '60%'},
                                height: {xs: '200px', md: 'auto'},
                                backgroundImage: 'url(../src/assets/login.png)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundColor: green[500],
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                padding: 3,
                            }}
                        />
                        <Box
                            sx={{
                                width: {xs: '100%', md: '40%'},
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: {xs: 2, md: 4},
                                backgroundColor: '#fff',
                            }}
                        >
                            <Typography component="h1" variant="h5" sx={{
                                color: '#1c7946',
                                fontWeight: 'bold',
                                mb: 1,
                                fontFamily: 'Poppins,sans-serif'
                            }}>
                                Ekim Rehberi
                            </Typography>
                            <Typography variant="body1" sx={{color: 'gray', mb: 3}}>
                                Hesabınızla Giriş Yapın
                            </Typography>
                            <Box
                                component="form"
                                onSubmit={handleLogin}
                                noValidate
                                sx={{width: '100%', mt: 1}}
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
                                    sx={{backgroundColor: '#f9f9f9', borderRadius: '8px'}}
                                    error={!!error && !validateEmail(email)}
                                    helperText={!!error && !validateEmail(email) ? 'Geçerli bir e-posta adresi giriniz.' : ''}
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
                                    sx={{backgroundColor: '#f9f9f9', borderRadius: '8px'}}
                                    error={!!error && password.length < 6}
                                    helperText={!!error && password.length < 6 ? 'Şifre en az 6 karakter olmalıdır.' : ''}
                                />
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary"/>}
                                    label="Beni Hatırla"
                                    sx={{mb: 2}}
                                />
                                <Box sx={{minHeight: '24px', mb: 2}}>
                                    {error && (
                                        <Alert severity="error">{error}</Alert>
                                    )}
                                </Box>

                                <SquareButton title="Giriş Yap" onClick={handleLogin}></SquareButton>
                                <LoginWithGoogle onSignIn="./home"></LoginWithGoogle>
                                <Grid container sx={{display: 'flex', justifyContent: 'center'}}>
                                    <Grid item xs>
                                        <Link href="#" variant="body2" sx={{color: 'gray'}}>
                                            Şifremi Unuttum
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body2" sx={{mt: 2, textAlign: 'center'}}>
                                            Üye değil misiniz?{' '}
                                            <Link href="/signup" variant="body2" sx={{color: '#1c7946'}}>
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
