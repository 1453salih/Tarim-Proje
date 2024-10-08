import React, { useState } from 'react';
import { Button, Box, Typography, CircularProgress, IconButton, LinearProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

function ImageUploader({ onImageUpload }) {
    const [selectedFileName, setSelectedFileName] = useState('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setLoading(true);
            setSelectedFileName(file.name);

            // Görsel önizlemesini ayarlama
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
                setLoading(false);
            };
            reader.readAsDataURL(file);

            // Dosyayı üst bileşene ilet
            onImageUpload(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedFileName('');
        setImagePreviewUrl('');
        onImageUpload(null);  // Üst bileşene seçimin iptal edildiğini bildir
    };

    return (
        <Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
            {!imagePreviewUrl && !loading && (
                <Box
                    sx={{
                        border: '2px dashed #ccc',
                        borderRadius: '10px',
                        p: 2,
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                        },
                    }}
                    onClick={() => document.getElementById('imageInput').click()}
                >
                    <CloudUploadIcon sx={{ fontSize: 40, color: '#ccc' }} />
                    <Typography variant="h6" sx={{ mt: 1, color: '#777' }}>
                        Resmi buraya sürükleyin veya seçmek için tıklayın
                    </Typography>
                    <input
                        type="file"
                        id="imageInput"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </Box>
            )}

            {loading && (
                <Box sx={{ mt: 2, width: '100%' }}>
                    <LinearProgress />
                </Box>
            )}

            {imagePreviewUrl && (
                <Box sx={{ position: 'relative', display: 'inline-block', mt: 2 }}>
                    <img
                        src={imagePreviewUrl}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px' }}
                    />
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            },
                        }}
                        onClick={handleRemoveImage}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="body1" sx={{ mt: 1 }}>{selectedFileName}</Typography>
                </Box>
            )}

            {error && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" color="error">{error}</Typography>
                </Box>
            )}
        </Box>
    );
}

export default ImageUploader;
