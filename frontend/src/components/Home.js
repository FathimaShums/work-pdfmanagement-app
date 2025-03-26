// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';

const Home = () => {
  return (
    <div>
      <div className="jumbotron">
        <h1 className="display-4">PDF Management System</h1>
        <p className="lead">
          Upload, store, and manage your PDF documents with ease.
        </p>
        <hr className="my-4" />
        <p>
          This application allows you to securely store your PDF documents in the cloud
          and access them from anywhere.
        </p>
      </div>
      
      <Row className="mt-4">
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Upload a PDF</Card.Title>
              <Card.Text>
                Upload a new PDF document to your collection.
              </Card.Text>
              <Button as={Link} to="/upload" variant="primary">
                Upload PDF
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>View Your PDFs</Card.Title>
              <Card.Text>
                Browse and view your uploaded PDF documents.
              </Card.Text>
              <Button as={Link} to="/pdfs" variant="success">
                View PDFs
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;