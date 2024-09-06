import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';

import card1 from '../assets/card1.webp';
import card2 from '../assets/card2.webp';
import card3 from '../assets/card3.webp';
import card4 from '../assets/card4.webp';
import card5 from '../assets/card5.webp';
import card6 from '../assets/card6.jpg';

const cards = [
    { button: 'Arazi Ekle', link: '/add-land', image: card1 },
    { button: 'Arazilerimi Görüntüle', link: '/land-list', image: card2 },
    { button: 'Ekim Yap', link: '/sowings', image: card4 },
    { button: 'Ekimlerim', link: '/sowing-list', image: card5 },
    { button: 'Hasatlarım', link: '/harvest-list', image: card6 },
    { button: 'Verim Degerlendir', link: '/evaluation-list', image: card3 },
];

function Home() {
    return (
        <Container>
            <Grid container spacing={4} sx={{ marginTop: 4 }}>
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
