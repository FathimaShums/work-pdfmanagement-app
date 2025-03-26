// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import UploadPdf from './components/UploadPdf';
import PdfList from './components/PdfList';
import ViewPdf from './components/ViewPdf';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<UploadPdf />} />
            <Route path="/pdfs" element={<PdfList />} />
            <Route path="/pdf/:id" element={<ViewPdf />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;