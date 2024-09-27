import React, { useEffect, useState } from "react";
import {
    Grid,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Box,
    Skeleton
} from "@mui/material";
import axios from "axios";
import { orange } from "@mui/material/colors";

const RecommendationsTable = ({ landId }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [imageLoading, setImageLoading] = useState({}); // Her bir resmin yüklenme durumu

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const localityResponse = await axios.get(`http://localhost:8080/lands/${landId}/locality`, { withCredentials: true });
                const localityCode = localityResponse.data.code;

                if (!localityCode) {
                    console.error("Yer kodu tanımsız");
                    return;
                }

                const recommendationsResponse = await axios.get(`http://localhost:8080/recommendations?localityCode=${localityCode}`, { withCredentials: true });
                setRecommendations(recommendationsResponse.data);

                // Her bir resmin yüklenme durumu başlangıçta true olarak ayarlanıyor
                const initialLoadingState = recommendationsResponse.data.reduce((acc, recommendation, index) => {
                    acc[index] = true;
                    return acc;
                }, {});
                setImageLoading(initialLoadingState);
            } catch (error) {
                console.error("Öneriler alınırken hata oluştu", error);
            }
        };

        if (landId) {
            fetchRecommendations();
        }
    }, [landId]);

    const handleImageLoad = (index) => {
        setImageLoading(prevState => ({
            ...prevState,
            [index]: false
        }));
    };

    return (
        <Grid item xs={12} md={6}>
            <Box component={Paper} elevation={6} sx={{ p: 3 }}>
                <Typography variant="h5" component="h3" gutterBottom>
                    Öneriler
                </Typography>
                {recommendations.length > 0 ? (
                    <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 12px rgba(0.2, 0.2, 0.2, 0.3)', mt:4 }}>
                        <Table sx={{ boxShadow: "1px 1px 1px 1px" }}>
                            <TableHead sx={{ backgroundColor: orange[700] }}>
                                <TableRow>
                                    <TableCell sx={{ color: "#fff", borderRight: '1px solid #ddd' }}>Bitki Görseli</TableCell>
                                    <TableCell sx={{ color: "#fff", borderRight: '1px solid #ddd' }}>Bitki Adı</TableCell>
                                    <TableCell sx={{ color: "#fff", borderRight: '1px solid #ddd' }}>Başarı Oranı</TableCell>
                                    <TableCell sx={{ color: "#fff", borderRight: '1px solid #ddd' }}>Hasat Dönemi</TableCell>
                                    <TableCell sx={{ color: "#fff" }}>Ekim Dönemi</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recommendations.map((recommendation, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ borderRight: '1px solid #ddd', position: 'relative' }}>
                                            {imageLoading[index] && (
                                                <Skeleton
                                                    variant="rectangular"
                                                    width={50}
                                                    height={50}
                                                    sx={{
                                                        borderRadius: '10px'
                                                    }}
                                                />
                                            )}
                                            <img
                                                src={`../../${recommendation.plantImage}`}
                                                alt={recommendation.plantName}
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    objectFit: 'cover',
                                                    borderRadius: '10px',
                                                    display: imageLoading[index] ? 'none' : 'block'
                                                }}
                                                onLoad={() => handleImageLoad(index)}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ borderRight: '1px solid #ddd' }}>{recommendation.plantName}</TableCell>
                                        <TableCell sx={{ borderRight: '1px solid #ddd' }}>{recommendation.succesRate}%</TableCell>
                                        <TableCell sx={{ borderRight: '1px solid #ddd' }}>{recommendation.harvestPeriod}</TableCell>
                                        <TableCell>{recommendation.sowingPeriod}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography>Mevcut öneri yok.</Typography>
                )}
            </Box>
        </Grid>
    );
};

export default RecommendationsTable;
