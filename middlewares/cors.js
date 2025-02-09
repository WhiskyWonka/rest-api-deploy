import cors from 'cors';

export const corsMiddleware = () => 
  cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:3000',
      'https://myfrontend.com'
    ];

    if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
});