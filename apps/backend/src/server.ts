import dotenv from 'dotenv';
// Load environment variables before importing app
dotenv.config();

import app from './app';
import prisma from './db';
import { config } from './config/env';

let server: any;

async function startServer() {
  try {
    // Check DB connection
    await prisma.$connect();
    console.log('Database connection successful');

    server = app.listen(config.port, () => {
      console.log(`Server is running in ${config.env} mode on port ${config.port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
      prisma.$disconnect().then(() => {
        console.log('Database connection closed.');
        process.exit(0);
      });
    });
  }
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
      prisma.$disconnect().then(() => {
        console.log('Database connection closed.');
        process.exit(0);
      });
    });
  }
});
