#!/bin/bash

# Thai Municipality Form Application Setup Script

echo "Setting up Thai Municipality Form Application..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install client dependencies
echo "Installing client dependencies..."
cd client
npm install
cd ..

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install
cd ..

echo "Setup complete! You can now run the application with 'npm run dev'" 