import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/logo.png';
import card1 from "../assets/card1.webp";
import card2 from "../assets/card2.webp";
import card4 from "../assets/card4.webp";
import card5 from "../assets/card5.webp";
import card6 from "../assets/card6.jpg";
import card3 from "../assets/card3.webp"; // Logo dosyasının yolu

const pages = [
    { link: '/add-land', title: 'Arazi Ekle' },
    { link: '/land-list', title: 'Arazilerimi Görüntüle' },
    { link: '/sowings', title: 'Ekim Yap' },
    { link: '/sowing-list', title: 'Ekimlerim' },
    { link: '/harvest-list', title: 'Hasatlarım' },
    { link: '/evaluation-list', title: 'Verim Degerlendir' },
];

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [anchorElDropdown, setAnchorElDropdown] = React.useState(null); // Dropdown için yeni state
    const navigate = useNavigate();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleOpenDropdown = (event) => {
        setAnchorElDropdown(event.currentTarget); // Dropdown menüyü aç
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleCloseDropdown = () => {
        setAnchorElDropdown(null); // Dropdown menüyü kapat
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/auth/logout', {}, { withCredentials: true });
            localStorage.removeItem('userId'); // localStorage'dan kullanıcı bilgilerini temizlenir.
            setIsLoggedIn(false); // Kullanıcı çıkış yaptıktan sonra isLoggedIn = false
            navigate('/login'); // Kullanıcıyı login sayfasına yönlendirir
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#007a37' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box
                        component="img"
                        src={Logo}
                        alt="Ekim Rehberi Logo"
                        sx={{ height: 40, marginRight: 2 }}
                    />

                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/home"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            textDecoration: 'none',
                            color: 'white',
                            fontFamily: 'Poppins, sans-serif',
                        }}
                    >
                        Ekim Rehberi
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                        >
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Typography textAlign="center" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                                    <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        Home
                                    </Link>
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>

                    {/* Dropdown menü ekleme */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button
                            onClick={handleOpenDropdown}
                            sx={{ my: 2, color: 'white', display: 'block', fontFamily: 'Poppins, sans-serif' }}
                        >
                            İşlemler
                        </Button>
                        <Menu
                            id="dropdown-menu"
                            anchorEl={anchorElDropdown}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElDropdown)}
                            onClose={handleCloseDropdown}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.title} onClick={handleCloseDropdown}>
                                    <Typography textAlign="center" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                                        <Link to={page.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            {page.title}
                                        </Link>
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Typography textAlign="center" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                                    <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        Profile
                                    </Link>
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Typography textAlign="center" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                                    <Link to="/settings" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        Settings
                                    </Link>
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <Typography textAlign="center" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Logout
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
