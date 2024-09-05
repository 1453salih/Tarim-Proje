import React from 'react';
import './Spinner.css'; // CSS dosyasını import ediyoruz

function Spinner() {
    return (
        <div className="spinner-container">
            <div className="loader"></div>
        </div>
    );
}

export default Spinner;
