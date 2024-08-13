import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AddLand from './components/AddLand';
import ViewLands from './components/ViewLands';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Contact from './components/Contact';
import Signup from './components/Signup';
import Login from './components/Login';
import LandList from './components/LandList';
import LandDetails from './components/LandDetails';
import AddSowing from './components/AddSowing';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS dosyasını dahil eder
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // (İsteğe bağlı) Bootstrap'in JS dosyalarını dahil eder



import './App.css';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/add-land" element={<AddLand />} />
                <Route path="/view-lands" element={<ViewLands />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/land-list" element={<LandList />} />
                <Route path="/lands/detail/:id" element={<LandDetails />} /> {/* Dinamik Route */}
                <Route path="/sowings" element={<AddSowing />} />
            </Routes>
        </Router>
    );
}

export default App;
