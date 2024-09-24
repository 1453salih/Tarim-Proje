import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AddLand from './components/AddLand';
// import Profile from './components/Profile';
import Settings from './components/Settings';
import Contact from './components/Contact';
import Signup from './components/Signup';
import Login from './components/Login';
import LandList from './components/LandList';
import LandDetails from './components/LandDetails';
import AddSowing from './components/AddSowing';
import SowingList from "./components/SowingList.jsx";
import SowingDetails from "./components/SowingDetails";
import HarvestList from "./components/HarvestList";
import HarevstEvaluation from "./components/HarevstEvaluation";
import EvaluationList from "./components/EvaluationList";
import EvaluationEdit from "./components/EvaluationEdit";



import Spinner from './Spinner/Spinner';


import './App.css';
// import EditProfile from "./components/EditProfile.jsx";


function NavbarWrapper({ isLoggedIn, setIsLoggedIn }) {
    const location = useLocation();
    const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';

    return !hideNavbar && <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />;
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:8080/auth/validate-token', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.isValid) {
                        setIsLoggedIn(true);
                    } else {
                        setIsLoggedIn(false);
                    }
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);  // Yükleme bittiğinde durumu güncelle
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    return (
        <Router>
            <NavbarWrapper isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Routes>
                <Route path="/" element={<Navigate to={isLoggedIn ? "/home" : "/login"} />} />
                <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
                <Route path="/add-land" element={isLoggedIn ? <AddLand /> : <Navigate to="/login" />} />
                {/*<Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />*/}
                <Route path="/settings" element={isLoggedIn ? <Settings /> : <Navigate to="/login" />} />
                <Route path="/contact" element={isLoggedIn ? <Contact /> : <Navigate to="/login" />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/land-list" element={isLoggedIn ? <LandList /> : <Navigate to="/login" />} />
                <Route path="/lands/detail/:id" element={isLoggedIn ? <LandDetails /> : <Navigate to="/login" />} />
                <Route path="/sowings" element={isLoggedIn ? <AddSowing /> : <Navigate to="/login" />} />
                <Route path="/sowing-list" element={isLoggedIn ? <SowingList /> : <Navigate to="/login" />} />
                <Route path="/sowings/detail/:id" element={isLoggedIn ? <SowingDetails /> : <Navigate to="/login" />} />
                <Route path="/evaluation" element={isLoggedIn ? <HarevstEvaluation /> : <Navigate to="/login" />} />
                <Route path="/harvest-list" element={isLoggedIn ? <HarvestList /> : <Navigate to="/login" />} />
                <Route path="/evaluation-list" element={isLoggedIn ? <EvaluationList /> : <Navigate to="/login" />} />
                <Route path="/evaluation/edit/:id" element={isLoggedIn ? <EvaluationEdit /> : <Navigate to="/login" />} />
                {/*<Route path="/edit-profile" element={isLoggedIn ? <EditProfile /> : <Navigate to="/login" />} />*/}
            </Routes>
        </Router>
    );
}

export default App;
