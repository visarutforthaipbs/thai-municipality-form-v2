# Thai Municipality Budget Form Application

A full-stack application for Thai municipalities to enter and manage their budget information.

## Project Structure

The project is now organized into two main parts:

- `client/`: React frontend application
- `server/`: Express.js backend API server

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or remote)

### Installation

1. Install dependencies for all parts of the application:

```bash
npm run install:all
```

This will install dependencies for the root project, client, and server.

### Development

To run both client and server in development mode:

```bash
npm run dev
```

This will start:

- Client on http://localhost:3000
- Server on http://localhost:5000

To run only the client:

```bash
npm run client
```

To run only the server:

```bash
npm run server
```

To run the server with hot-reloading:

```bash
npm run dev:server
```

### Building for Production

To build the client application:

```bash
npm run build
```

This will create a production build in the `client/build` directory.

## API Endpoints

- `GET /api/municipalities`: Get all municipalities
- `GET /api/municipalities/:code`: Get a specific municipality by code
- `POST /api/saveFormData`: Save or update municipality data

## Features

- บันทึกข้อมูลเทศบาลและงบประมาณ
- เพิ่มรายละเอียดแผนงบประมาณได้หลายรายการ
- ค้นหาข้อมูลเทศบาลจากชื่อหรือรหัส
- บันทึกข้อมูลลงฐานข้อมูล MongoDB
- แปลงข้อมูลเป็นรูปแบบ JSON

## Prerequisites

- Node.js (version 16 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/thai-municipality-form-v2.git
   cd thai-municipality-form-v2
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Configure MongoDB:
   - Create a `.env` file in the root directory
   - Add your MongoDB connection string:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/municipality-budget
   ```
   - For MongoDB Atlas, use a connection string like:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/municipality-budget?retryWrites=true&w=majority
   ```

## Running the Application

### Development Mode (Frontend + Backend)

Run both the frontend and backend servers in development mode:

```
npm run dev
```

This will start:

- React frontend on http://localhost:3000
- Express backend on http://localhost:5000

### Backend Only

Run only the backend server:

```
npm run server
```

### Frontend Only

Run only the frontend server:

```
npm start
```

## Build for Production

Create a production build of the frontend:

```
npm run build
```

## Project Structure

- `src/` - React frontend application
- `server/` - Express backend application
  - `server/index.js` - Main server entry point
  - `server/db.js` - MongoDB connection and models
  - `server/routes.js` - API routes

## Deployment

To deploy this application:

1. Set up a MongoDB instance (MongoDB Atlas recommended for production)
2. Deploy the Express backend to a hosting service (Heroku, DigitalOcean, etc.)
3. Update the API URL in `src/components/MunicipalityForm.tsx` to point to your deployed backend
4. Deploy the React frontend (Netlify, Vercel, etc.)

## License

This project is licensed under the MIT License.
