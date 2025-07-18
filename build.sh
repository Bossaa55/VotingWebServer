#!/bin/bash

# Script to build React frontend and copy to backend

echo "Building React frontend..."
cd frontend
npm run build

if [ $? -eq 0 ]; then
    echo "Build successful! Copying files to backend..."
    cp -r dist/* ../backend/app/frontend/
    echo "Frontend files copied successfully!"
    echo "You can now start the FastAPI server to serve both API and frontend."
else
    echo "Build failed!"
    exit 1
fi
