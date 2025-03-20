# Conversation App

A responsive web application for managing conversations, built with React.js and Node.js.

## Features

- Responsive design for mobile and web
- Real-time conversation updates
- User-friendly chat interface
- Secure backend API
- Docker containerization for easy deployment

## Tech Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS for responsive design
- React Hooks for state management

### Backend
- Node.js with Express
- PostgreSQL for database (configurable)
- RESTful API design

## Development Setup

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- PostgreSQL (optional for production)
- Docker and Docker Compose (for containerized setup)

### Option 1: Running with Docker

1. Clone the repository
2. Start the application using Docker Compose:
   ```
   docker-compose up -d
   ```
3. Access the frontend at [http://localhost](http://localhost)
4. Access the backend API at [http://localhost:5000](http://localhost:5000)
5. To stop the application:
   ```
   docker-compose down
   ```

### Option 2: Running Locally

#### Frontend Setup
1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

#### Backend Setup
1. Navigate to the server directory:
   ```
   cd server
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on the provided example
4. Start the server:
   ```
   npm run dev
   ```
5. The API will be available at [http://localhost:5000](http://localhost:5000)

## Deployment

### Docker Deployment
1. Build the Docker images:
   ```
   docker-compose build
   ```
2. Run the containers:
   ```
   docker-compose up -d
   ```
3. For production, update the environment variables in `docker-compose.yml`

### Frontend Deployment (Netlify)
1. Push your code to a GitHub repository
2. Connect the repository to Netlify
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Environment variables: Set `REACT_APP_API_URL` to your backend URL

### Backend Deployment (Digital Ocean)
1. Create a Digital Ocean Droplet
2. Set up Node.js and PostgreSQL on the Droplet
3. Clone the repository to the Droplet
4. Configure environment variables for production
5. Set up PM2 or similar for process management
6. Configure Nginx as a reverse proxy

## Production Considerations
- Use environment variables for sensitive configuration
- Implement proper authentication and authorization
- Set up HTTPS for secure communication
- Configure CORS appropriately
- Add rate limiting to protect the API
- When using Docker in production, configure volumes for data persistence

## License
MIT 