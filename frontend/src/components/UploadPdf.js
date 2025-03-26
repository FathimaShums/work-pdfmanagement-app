// src/components/UploadPdf.js
import React, { useState } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UploadPdf = () => {
  const [file, setFile] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Validate file type
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      setError('Please select a PDF file');
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!file) {
      setError('Please select a PDF file to upload');
      return;
    }
    
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!userEmail.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Create form data
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('userName', userName);
    formData.append('userEmail', userEmail);
    
    try {
      const response = await axios.post('http://localhost:5000/api/pdfs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess('PDF uploaded successfully!');
      setLoading(false);
      
      // Reset form
      setFile(null);
      setUserName('');
      setUserEmail('');
      
      // Redirect to PDF list after 2 seconds
      setTimeout(() => {
        navigate('/pdfs');
      }, 2000);
      
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.error || 'Error uploading PDF. Please try again.');
      console.error('Upload error:', error);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Upload a PDF Document</h2>
      
      <Card>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Your Name</Form.Label>
              <Form.Control 
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                disabled={loading}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Your Email</Form.Label>
              <Form.Control 
                type="email" 
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Enter your email address"
                disabled={loading}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>PDF File</Form.Label>
              <Form.Control 
                type="file" 
                onChange={handleFileChange}
                accept="application/pdf"
                disabled={loading}
              />
              <Form.Text className="text-muted">
                Only PDF files are allowed (max 10MB)
              </Form.Text>
            </Form.Group>
            
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner 
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  {' '}Uploading...
                </>
              ) : 'Upload PDF'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UploadPdf;