# PDF Management Web Application

A web application for uploading, storing, and viewing PDF documents using React, Node.js, MongoDB, and AWS S3.

## Features

- PDF upload with user information
- List view of all uploaded PDFs
- PDF viewer with preview functionality
- Secure storage using AWS S3
- MongoDB database for metadata storage

## Technology Stack

- **Frontend**: React, React Bootstrap, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **Storage**: AWS S3
- **Deployment**: AWS EC2, S3, CloudFront

## Setup Instructions

### Prerequisites
- Node.js and npm
- MongoDB Atlas account
- AWS account with S3 bucket

### Backend Setup
1. Navigate to the backend directory: \`cd backend\`
2. Install dependencies: \`npm install\`
3. Create a \`.env\` file with the following variables:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name

4. Start the server: \`npm start\`

### Frontend Setup
1. Navigate to the frontend directory: \`cd frontend\`
2. Install dependencies: \`npm install\`
3. Create a \`.env\` file with: \`REACT_APP_API_URL=http://localhost:5000/api\`
4. Start the development server: \`npm start\`

## Deployment

See the deployment documentation for instructions on deploying to AWS.
