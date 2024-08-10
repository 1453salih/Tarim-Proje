import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

import card1 from '../assets/card1.jpg';
import card2 from '../assets/card2.jpg';
import card3 from '../assets/card3.jpg';
import card4 from '../assets/card4.jpg';
// import card5 from '../assets/card5.png';
// import card6 from '../assets/card6.png';

const cards = [
    { title: 'Arazi Ekle', description: '', link: '/add-land',button:'Arazi Ekle',image:card1},
    { title: 'Arazilerim', description: '',button:'Arazilerimi Görüntüle', link: '/land-list',image:card2,},
    { title: 'Veriminizi Degerlendiriniz',button:'Verim Degerlendir', link: '/degerlendirme',image:card3 },
    { title: 'Ekim Yap', description: '',button:'Ekim Yap',link: '/planting',image:card4},
    { title: 'Card 5', description: 'Description 5', link: '/link5',image:'' },
    { title: 'Card 6', description: 'Description 6', link: '/link6',image:'' },
];

function Home() {
    return (
        <Container>
            <Typography variant="h2" component="div" gutterBottom>
               Menü
            </Typography>
            <Typography variant="body1" component="p">

            </Typography>
            <Grid container spacing={4} sx={{ marginTop: 2 }}>
                {cards.map((card, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                image={card.image}
                                alt="Placeholder Image"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {card.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {card.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" component={Link} to={card.link}>
                                    {card.button}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Home;
