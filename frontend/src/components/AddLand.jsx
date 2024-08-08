import React, {useState, useEffect} from 'react';
import {TextField, Button, Container, Typography, Box, MenuItem, FormControl, InputLabel, Select} from '@mui/material';
import ilIlceData from '../Data/il-ilce.json';
import koylerData from '../Data/koyler.json';

function AddLand() {
    const [landName, setLandName] = useState();
    const [landSize, setLandSize] = useState();
    const [selectedIl, setSelectedIl] = useState();
    const [selectedIlce, setSelectedIlce] = useState();
    const [selectedKoy, setSelectedKoy] = useState();
    const [ilceler, setIlceler] = useState([]);
    const [koyler, setKoyler] = useState([]);

    useEffect(() => {
        if (selectedIl) {
            const ilceList = ilIlceData
                .filter(item => item.il.localeCompare(selectedIl, undefined, {sensitivity: 'base'}) === 0)
                .map(item => item.ilce);
            console.log('Selected İl:', selectedIl);
            console.log('İlçeler:', ilceList);
            setIlceler(ilceList);
            setSelectedIlce('');
            setKoyler([]);
            setSelectedKoy('');
        }
    }, [selectedIl]);

    useEffect(() => {
        if (selectedIlce) {
            const koyList = koylerData
                .filter(item => item.il.localeCompare(selectedIl, undefined, {sensitivity: 'base'}) === 0 && item.ilce.localeCompare(selectedIlce, undefined, {sensitivity: 'base'}) === 0)
                .map(item => item.mahalle_koy);
            console.log('Selected İl:', selectedIl);
            console.log('Selected İlçe:', selectedIlce);
            console.log('Köyler:', koyList);
            setKoyler(koyList);
            setSelectedKoy('');
        } else {
            setKoyler([]);
        }
    }, [selectedIlce, selectedIl]);
    //!Verilerin Formdan alındığı alan
    const handleAddLand = async (e) => {
        e.preventDefault();
        const newLand = {
            landName,
            landSize: parseFloat(landSize),
            selectedIl,
            selectedIlce,
            selectedKoy
        };
        try {
            const response = await fetch('http://localhost:8080/lands', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({newLand}),
            });
            if (response.ok) {
                console.log("Land saved successfully");
                // Form temizlenir
                setLandName('');
                setLandSize('');
                setSelectedIl('');
                setSelectedKoy('');
                setSelectedIlce('');
            } else {
                console.error('Failed to save the Land')
            }
        } catch (error) {
            console.error('error', error);
        }
    };
    return (
        <Container maxWidth="sm">
            <Box component="form" onSubmit={handleAddLand} sx={{ mt: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Add Land
                </Typography>
                <TextField
                    fullWidth
                    label="Land Name"
                    variant="outlined"
                    margin="normal"
                    value={landName}
                    onChange={(e) => setLandName(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="Land Size (hectares)"
                    variant="outlined"
                    margin="normal"
                    value={landSize}
                    onChange={(e) => setLandSize(e.target.value)}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>İl</InputLabel>
                    <Select
                        value={selectedIl}
                        onChange={(e) => setSelectedIl(e.target.value)}
                    >
                        {Array.from(new Set(ilIlceData.map(item => item.il))).map(il => (
                            <MenuItem key={il} value={il}>{il}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" disabled={!selectedIl}>
                    <InputLabel>İlçe</InputLabel>
                    <Select
                        value={selectedIlce}
                        onChange={(e) => setSelectedIlce(e.target.value)}
                    >
                        {ilceler.map((ilce, index) => (
                            <MenuItem key={index} value={ilce}>{ilce}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" disabled={!selectedIlce || koyler.length === 0}>
                    <InputLabel>Köy/Mahalle</InputLabel>
                    <Select
                        value={selectedKoy}
                        onChange={(e) => setSelectedKoy(e.target.value)}
                    >
                        {koyler.map((koy, index) => (
                            <MenuItem key={index} value={koy}>{koy}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Add Land
                </Button>
            </Box>
        </Container>
    );
}

export default AddLand;