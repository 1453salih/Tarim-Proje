import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import BreadcrumbComponent from "./BreadCrumb.jsx";
import card1 from '../assets/card1.webp';
import card2 from '../assets/card2.webp';
import card3 from '../assets/card3.webp';
import card4 from '../assets/card4.webp';
import card5 from '../assets/card5.webp';
import card6 from '../assets/card6.jpg';

// İkonları ekliyoruz
import LandscapeIcon from '@mui/icons-material/Landscape';

const cards = [
    { button: 'Arazi Ekle', link: '/add-land', image: card1 },
    { button: 'Arazilerimi Görüntüle', link: '/land-list', image: card2 },
    { button: 'Ekim Yap', link: '/sowings', image: card4 },
    { button: 'Ekimlerim', link: '/sowing-list', image: card5 },
    { button: 'Hasatlarım', link: '/harvest-list', image: card6 },
    { button: 'Verim Degerlendir', link: '/evaluation-list', image: card3 },
];

function Home() {
    const [landCount, setLandCount] = useState(0);

    // Arazi sayısını almak için useEffect
    useEffect(() => {
        const fetchLandCount = async () => {
            try {
                const response = await fetch('http://localhost:8080/lands/user/lands/count'); // API URL'ini backend'e göre değiştirin
                const data = await response.json();
                setLandCount(data);
            } catch (error) {
                console.error('Arazi sayısı alınamadı:', error);
            }
        };

        fetchLandCount();
    }, []);

    return (
        <Container>
            <Grid container spacing={4} sx={{ marginTop: 4 }}>
                {/* Kullanıcının toplam arazi sayısını gösteren kart */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            position: 'relative',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
                            },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '250px',
                        }}
                    >
                        {/* İkon */}
                        <LandscapeIcon
                            sx={{
                                fontSize: 50,
                                color: '#3f51b5',
                                marginBottom: '10px'
                            }}
                        />
                        <Typography
                            variant="h4"
                            sx={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 600,
                                color: '#3f51b5',
                            }}
                        >
                            {landCount}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 400,
                                color: '#3f51b5',
                                marginTop: '10px',
                            }}
                        >
                            Toplam Arazi Sayısı
                        </Typography>
                    </Card>
                </Grid>

                {/* Mevcut kartlar */}
                {cards.map((card, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                        <Link to={card.link} style={{ textDecoration: 'none' }}>
                            <Card
                                sx={{
                                    position: 'relative',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
                                    },
                                    '&:hover::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '100%',
                                        background: 'linear-gradient(120deg, rgba(255,255,255,0.2), rgba(255,255,255,0))',
                                    },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="250"
                                    image={card.image}
                                    alt={card.button}
                                    sx={{
                                        transition: 'transform 0.4s ease',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                        },
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                                        color: 'white',
                                        padding: '15px',
                                        textAlign: 'center',
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontWeight: 600
                                        }}
                                    >
                                        {card.button}
                                    </Typography>
                                </Box>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Home;
