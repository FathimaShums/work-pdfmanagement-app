// src/components/ViewPdf.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Alert, Spinner, Card } from 'react-bootstrap';
import axios from 'axios';

const ViewPdf = () => {
  const { id } = useParams();
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfInfo, setPdfInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPdfInfo();
  }, [id]);

  const fetchPdfInfo = async () => {
    try {
      setLoading(true);
      
      // Get PDF document details
      try {
        const infoResponse = await axios.get(`${process.env.REACT_APP_API_URL}/pdfs/${id}`);
        setPdfInfo(infoResponse.data);
        
        if (!infoResponse.data) {
          setError('PDF document not found in database.');
          setLoading(false);
          return;
        }
      } catch (infoError) {
        if (infoError.response && infoError.response.status === 404) {
          setError('PDF document not found in database.');
        } else {
          setError(`Error retrieving PDF metadata: ${infoError.message}`);
        }
        setLoading(false);
        return;
      }
      
      // Get a pre-signed URL for viewing
      try {
        const urlResponse = await axios.get(`${process.env.REACT_APP_API_URL}/pdfs/view/${id}`);
        
        if (!urlResponse.data || !urlResponse.data.url) {
          setError('Unable to generate access URL for the PDF.');
          setLoading(false);
          return;
        }
        
        setPdfUrl(urlResponse.data.url);
      } catch (urlError) {
        if (urlError.response) {
          if (urlError.response.status === 403) {
            setError('You do not have permission to view this PDF file.');
          } else if (urlError.response.status === 404) {
            setError('The PDF file does not exist in storage.');
          } else {
            setError(`Server error: ${urlError.response.data.error || urlError.message}`);
          }
        } else if (urlError.request) {
          setError('Cannot connect to the server. Please try again later.');
        } else {
          setError(`Error accessing the PDF: ${urlError.message}`);
        }
        setLoading(false);
        return;
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching PDF:', error);
      setError('An unexpected error occurred while loading the PDF document.');
      setLoading(false);
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
        <p className="mt-2">Loading PDF document...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Alert variant="danger">{error}</Alert>
        <Button as={Link} to="/pdfs" variant="primary">
          Back to PDF List
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Viewing PDF Document</h2>
        <Button as={Link} to="/pdfs" variant="outline-primary">
          Back to List
        </Button>
      </div>
      
      {pdfInfo && (
        <Card className="mb-4">
          <Card.Body>
            <h4>{pdfInfo.fileName}</h4>
            <p className="mb-1"><strong>Uploaded by:</strong> {pdfInfo.userName}</p>
            <p className="mb-1"><strong>Email:</strong> {pdfInfo.userEmail}</p>
            <p><strong>Uploaded on:</strong> {formatDate(pdfInfo.uploadDate)}</p>
            
            <Button 
              href={pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              variant="success"
              className="mt-2"
            >
              Open in New Tab
            </Button>
          </Card.Body>
        </Card>
      )}
      
      <div className="pdf-container">
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            title="PDF Viewer"
            width="100%"
            height="600px"
            style={{ border: '1px solid #dee2e6', borderRadius: '0.25rem' }}
          />
        ) : (
          <Alert variant="warning">
            Unable to load PDF preview. Please try opening in a new tab.
          </Alert>
        )}
      </div>
    </div>
  );
};

export default ViewPdf;