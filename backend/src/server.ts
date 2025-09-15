import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { StatusCodes } from 'http-status-codes';
import reviewsRouter from './routes/reviews';
import { createServices } from './services/ServiceFactory';

const app = express();

// Create services using factory function (simplified dependency injection)
const { configurationService, logger } = createServices();

// HTTP request logging with Morgan (simplified)
app.use(morgan('combined'));

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://flexliving-1.onrender.com',
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/reviews', reviewsRouter);

app.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Flex Living Reviews API'
  });
});

app.get('/api/health', (req, res) => {
  res.status(StatusCodes.OK).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Flex Living Reviews API'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', 'Server');
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR'
  });
});

// 404 handler
app.use('*', (req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`, 'Server');
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    error: 'Route not found',
    code: 'NOT_FOUND'
  });
});

// Export for Vercel
export default app;

// For non-serverless environments
if (!process.env.VERCEL) {
  const port = configurationService.getPort();
  app.listen(port, () => {
    logger.info(`Server running on port ${port}`, 'Server');
    logger.info(`Environment: ${configurationService.getNodeEnv()}`, 'Server');
    logger.info('Flex Living Reviews API is ready!', 'Server');
  });
}
