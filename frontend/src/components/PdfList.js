// src/components/PdfList.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PdfList = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPdfs();
  }, []);

  const fetchPdfs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/pdfs');
      setPdfs(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch PDF documents. Please try again later.');
      setLoading(false);
      console.error('Error fetching PDFs:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading PDF documents...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">PDF Documents</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {!loading && pdfs.length === 0 ? (
        <Alert variant="info">
          No PDF documents found. <Link to="/upload">Upload a PDF</Link> to get started.
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Uploaded By</th>
              <th>Email</th>
              <th>Upload Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pdfs.map((pdf) => (
              <tr key={pdf._id}>
                <td>{pdf.fileName}</td>
                <td>{pdf.userName}</td>
                <td>{pdf.userEmail}</td>
                <td>{formatDate(pdf.uploadDate)}</td>
                <td>
                  <Button
                    as={Link}
                    to={`/pdf/${pdf._id}`}
                    variant="primary"
                    size="sm"
                  >
                    View PDF
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      
      <Button 
        variant="success" 
        as={Link} 
        to="/upload"
        className="mt-3"
      >
        Upload New PDF
      </Button>
    </div>
  );
};

export default PdfList;