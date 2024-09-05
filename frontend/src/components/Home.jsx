import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import BreadcrumbComponent from "./BreadCrumb";
import {Link} from 'react-router-dom';
import Box from '@mui/material/Box';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import '@fontsource/poppins';

const theme = createTheme({
    typography: {
        fontFamily: 'Poppins, sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontFamily: 'Poppins, sans-serif',
                    textTransform: 'none',
                },
            },
        },
    },
});

import card1 from '../assets/card1.webp';
import card2 from '../assets/card2.webp';
import card3 from '../assets/card3.webp';
import card4 from '../assets/card4.webp';
import card5 from '../assets/card5.webp';
import card6 from '../assets/card6.jpg';

const pageName = "Ekim Yap";

const cards = [
    {title: 'Arazi Ekle', description: '', link: '/add-land', button: 'Arazi Ekle', image: card1},
    {title: 'Arazilerim', description: '', button: 'Arazilerimi Görüntüle', link: '/land-list', image: card2},
    {title: 'Ekim İşlemleri', description: '', button: 'Ekim Yap', link: '/sowings', image: card4},
    {title: 'Ekimlerim', description: '', button: 'Ekimlerim', link: '/sowing-list', image: card5},
    {title: 'Hasatlarım', description: '', button: 'Hasatlarım', link: '/harvest-list', image: card6},
    {title: 'Değerlendirmelerim', button: 'Degerlendirmelerim', link: '/evaluation-list', image: card3},
];

function Home() {
    return (
        <ThemeProvider theme={theme}>


            <Container>
                <Box>
                    <BreadcrumbComponent pageName="Menu"/>
                </Box>

                {/* Diğer içerikler */}
                <Grid container spacing={4}>
                    {cards.map((card, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    boxShadow: 'inset -2px -2px 5px rgba(0, 0, 0, 0.25), inset 2px 2px 5px rgba(255, 255, 255, 0.75), 8px 8px 16px rgba(0, 0, 0, 0.2), -8px -8px 16px rgba(255, 255, 255, 0.7)', // İç ve dış gölge
                                    borderRadius: 2,
                                    fontFamily: 'Poppins, sans-serif',
                                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.1) rotate(1deg)',
                                        boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.25), inset -4px -4px 8px rgba(255, 255, 255, 0.75)', // Hover sırasında iç gölge, dış gölge yok
                                    },
                                    '&:active': {
                                        boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.3), inset -4px -4px 8px rgba(255, 255, 255, 0.6)', // Tıklanırken biraz daha belirgin iç gölge
                                    },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={card.image}
                                    alt={card.title}
                                />
                                <CardContent sx={{flexGrow: 1}}>
                                    <Typography gutterBottom variant="h5" component="div"
                                                sx={{fontFamily: 'Poppins, sans-serif'}}>
                                        {card.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph
                                                sx={{fontFamily: 'Poppins, sans-serif'}}>
                                        {card.description}
                                    </Typography>
                                    <Box sx={{mt: 2}}>
                                        <Link to={card.link} style={{textDecoration: 'none'}}>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                size="large"
                                                sx={{
                                                    backgroundColor: '#ff8a00', // Turuncu renk
                                                    color: 'white',
                                                    fontFamily: 'Poppins, sans-serif',
                                                    borderRadius: '5px',
                                                    boxShadow: 'inset -2px -2px 5px rgba(0, 0, 0, 0.25), inset 2px 2px 5px rgba(255, 255, 255, 0.75), 8px 8px 16px rgba(0, 0, 0, 0.2), -8px -8px 16px rgba(255, 255, 255, 0.7)', // İç ve dış gölge
                                                    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                                                    '&:hover': {
                                                        backgroundColor: '#ff8a00', // Aynı renk kalsın
                                                        boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.25), inset -4px -4px 8px rgba(255, 255, 255, 0.75)', // İç gölge, basılı efekt
                                                    },
                                                    '&:active': {
                                                        backgroundColor: '#FF8C00', // Basıldığında daha koyu turuncu
                                                        boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.3), inset -4px -4px 8px rgba(255, 255, 255, 0.6)', // Biraz daha belirgin iç gölge
                                                    },
                                                }}

                                            >
                                                {card.button}
                                            </Button>


                                        </Link>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </ThemeProvider>
    );
}

export default Home;
