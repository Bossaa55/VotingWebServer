# VotingWebServer 🗳️

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

A modern, real-time voting web application built with FastAPI and React. Features a clean user interface for voting, comprehensive admin panel for managing participants and voting sessions, and real-time updates via WebSocket connections.

## ✨ Features

### For Voters
- **Intuitive Voting Interface**: Clean and user-friendly voting cards with participant photos
- **Vote Confirmation**: Double-confirmation modal to prevent accidental votes
- **Visual Feedback**: Confetti animation and success confirmation after voting

### For Administrators
- **Participant Management**: Add, edit, and delete participants with image uploads
- **Voting Process Control**: Start, stop, and reset voting sessions
- **Real-time Dashboard**: Live vote counts and participant rankings
- **Configurable Countdown**: Set custom voting duration (minutes and seconds)
- **Session Management**: Reset votes and manage voting rounds
- **Secure Authentication**: JWT-based admin authentication system

### Technical Features
- **Real-time Updates**: WebSocket connections for live vote counting
- **Session Management**: Prevents double voting with session tracking
- **Image Management**: Automatic image handling and serving
- **Database Integration**: MySQL database with proper indexing and relationships
- **Containerized Deployment**: Docker Compose for easy deployment
- **API Documentation**: Automatic OpenAPI/Swagger documentation

## 📋 Requirements

- **Docker & Docker Compose**: For containerized deployment
- **Node.js 18+**: For frontend building

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bossaa55/VotingWebServer.git
   cd VotingWebServer
   ```

2. **Create environment file**
   ```bash
   cd backend
   cp .env.example .env
   ```
   Edit the `.env` file with your database credentials and JWT secret:
   ```env
   DATABASE_USER=your_db_user
   DATABASE_PASSWORD=your_db_password
   DATABASE_NAME=voting_db
   JWT_SECRET_KEY=your_jwt_secret_key
   INITIAL_ADMIN_USERNAME=admin
   INITIAL_ADMIN_PASSWORD=admin_password
   ```

3. **Build and run the application**
   ```bash
   # Build the frontend
   ./build.sh

   # Start the services
   cd backend
   docker-compose up --build -d
   ```

4. **Access the application**
   - **Main App**: http://localhost:8000
   - **Admin Panel**: http://localhost:8000/admin

## 📚 Usage

### For Voters

1. **Access the Voting Page**: Navigate to the main application URL
2. **View Participants**: Browse through available participants with their photos
3. **Cast Your Vote**: Click on "Votar" button for your preferred participant
4. **Confirm Vote**: Double-confirm your selection in the modal
5. **View Confirmation**: See success message with confetti animation

### For Administrators

1. **Login**: Access `/admin` and login with admin credentials
2. **Manage Participants**:
   - Add new participants with names and photos
   - Edit existing participant information
   - Delete participants as needed
3. **Control Voting Process**:
   - Set countdown duration (minutes and seconds)
   - Start voting session
   - Monitor real-time vote counts
   - Stop voting when needed
   - Reset votes for new rounds