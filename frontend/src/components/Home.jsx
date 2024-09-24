import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Pie } from 'react-chartjs-2'; // Pasta grafik için ekledik
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

import LandscapeIcon from '@mui/icons-material/Landscape';
import AgricultureIcon from '@mui/icons-material/Agriculture';

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
    const [landCount, setLandCount] = useState(0);
    const [cultivatedLandCount, setCultivatedLandCount] = useState(0); // Ekili arazi sayısı için state
    const [harvestData, setHarvestData] = useState({
        labels: [], // Varsayılan boş etiketler
        datasets: [
            {
                label: 'Hasat Kilogramları', // Yeni etiket
                data: [], // Varsayılan boş veri
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
            }
        ]
    });

    // Arazi sayısını alır.
    useEffect(() => {
        const fetchLandCount = async () => {
            try {
                const response = await axios.get('http://localhost:8080/lands/user/lands/count', {
                    withCredentials: true,
                });
                setLandCount(response.data);
            } catch (error) {
                console.error('Arazi sayısı alınamadı:', error);
            }
        };

        const fetchCultivatedLandCount = async () => {
            try {
                const response = await axios.get('http://localhost:8080/harvests/user/harvest/count', {
                    withCredentials: true,
                });
                setCultivatedLandCount(response.data);
            } catch (error) {
                console.error('Ekili arazi sayısı alınamadı:', error);
            }
        };

        // Hasat edilen ürünlerin kilogram verilerini alır.
        const fetchHarvestData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/evaluations/products/top', {
                    withCredentials: true,
                });
                console.log("Response:", response);
                const labels = response.data.map(item => item.plantName); // Bitki isimleri
                const data = response.data.map(item => item.productQuantity); // Ürün miktarları

                if (labels.length && data.length) { // Eğer veri geldiyse state'i güncelle
                    setHarvestData({
                        labels: labels,
                        datasets: [
                            {
                                label: 'Hasat Edilen Ürünlerin Kilogramları',
                                data: data,
                                backgroundColor: [
                                    '#FF6384',
                                    '#36A2EB',
                                    '#FFCE56',
                                    '#4BC0C0',
                                    '#9966FF',
                                    '#FF9F40'
                                ],
                                hoverBackgroundColor: [
                                    '#FF6384',
                                    '#36A2EB',
                                    '#FFCE56',
                                    '#4BC0C0',
                                    '#9966FF',
                                    '#FF9F40'
                                ]
                            }
                        ]
                    });
                }
            } catch (error) {
                console.error('Hasat verileri alınamadı:', error.response ? error.response.data : error.message);
            }
        };

        fetchLandCount();
        fetchCultivatedLandCount(); // Ekili arazi sayısını da alır.
        fetchHarvestData(); // Hasat edilen ürün verilerini alır.
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

                {/* Ekili arazi sayısını gösteren kart */}
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
                        <AgricultureIcon
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
                            {cultivatedLandCount}
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
                            Ekili Arazi Sayısı
                        </Typography>
                    </Card>
                </Grid>

                {/* Pasta Grafiği */}
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
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 600,
                                marginBottom: '10px',
                                color: '#3f51b5',
                            }}
                        >
                            Yıllık Ürün Hasat (kg)
                        </Typography>
                        <Box sx={{ height: '200px', width: '200px', overflow: 'hidden' }}>
                            <Pie
                                data={harvestData}
                                options={{
                                    maintainAspectRatio: false,
                                }}
                                style={{ height: '100%', width: '100%' }}
                            />
                        </Box>
                    </Card>
                </Grid>

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
