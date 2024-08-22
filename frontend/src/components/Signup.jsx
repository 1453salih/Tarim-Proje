import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';

function Signup() {
    const [email, setEmail] = useState('');  // user yerine email
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
                localStorage.setItem('userId', userId);  // userId'yi localStorage'da sakla

                setMessage('Signup successful. Redirecting to home page...');
                setTimeout(() => {
                    navigate('/home');  // Ana sayfaya yönlendir
                }, 2000);
            } else {
                setError('Signup failed. Please try again.');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('An error occurred');
            }
        }
    };




    return (
        <Container maxWidth="sm">
            <Box component="form" onSubmit={handleSignup} sx={{ mt: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Signup
                </Typography>
                <TextField
                    fullWidth
                    label="Email"  // Username yerine Email
                    variant="outlined"
                    margin="normal"
                    value={email}  // user yerine email
                    onChange={(e) => setEmail(e.target.value)}  // user yerine email
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <Alert severity="error">{error}</Alert>}
                {message && <Alert severity="success">{message}</Alert>}
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Signup
                </Button>
            </Box>
        </Container>
    );
}

export default Signup;
