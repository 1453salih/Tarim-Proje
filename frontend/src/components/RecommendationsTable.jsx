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
    Paper
} from "@mui/material";
import axios from "axios";

const RecommendationsTable = ({ landId }) => {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const localityResponse = await axios.get(`http://localhost:8080/lands/${landId}/locality`, { withCredentials: true });
                const localityCode = localityResponse.data.code;

                if (!localityCode) {
                    console.error("Locality code is undefined");
                    return;
                }

                const recommendationsResponse = await axios.get(`http://localhost:8080/recommendations?localityCode=${localityCode}`, { withCredentials: true });
                setRecommendations(recommendationsResponse.data);
            } catch (error) {
                console.error("Error Fetching Recommendations", error);
            }
        };

        if (landId) {
            fetchRecommendations();
        }
    }, [landId]);

    return (
        <Grid item xs={12} md={6}>
            <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 3, mb: 3 }}>
                Recommendations
            </Typography>
            {recommendations.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Plant Image</TableCell>
                                <TableCell>Plant Name</TableCell>
                                <TableCell>Success Rate</TableCell>
                                <TableCell>Harvest Period</TableCell>
                                <TableCell>Sowing Period</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recommendations.map((recommendation, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <img
                                            src={`../../${recommendation.plantImage}`}
                                            alt={recommendation.plantName}
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                objectFit: 'cover',
                                                borderRadius: '10px'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{recommendation.plantName}</TableCell>
                                    <TableCell>{recommendation.succesRate}%</TableCell>
                                    <TableCell>{recommendation.harvestPeriod}</TableCell>
                                    <TableCell>{recommendation.sowingPeriod}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography>No recommendations available.</Typography>
            )}
        </Grid>
    );
};

export default RecommendationsTable;
