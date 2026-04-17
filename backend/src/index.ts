import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import serviceRoutes from './routes/services';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use('/api/services', serviceRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 7. 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

// 7. Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message 
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
