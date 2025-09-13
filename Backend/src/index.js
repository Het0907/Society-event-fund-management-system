import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectToDatabase } from './lib/db.js';
import { membersRouter } from './routes/members.js';
import { eventsRouter } from './routes/events.js';
import { contributionsRouter } from './routes/contributions.js';
import { expensesRouter } from './routes/expenses.js';
import { reportsRouter } from './routes/reports.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: clientOrigin }));
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Test endpoint
app.get('/api/test', async (_req, res) => {
  try {
    const { Event } = await import('./models/Event.js');
    const count = await Event.countDocuments();
    res.json({ ok: true, eventCount: count, dbConnected: true });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ ok: false, error: error.message, dbConnected: false });
  }
});

// Routers
app.use('/api/members', membersRouter);
app.use('/api/events', eventsRouter);
app.use('/api/events/:eventId/contributions', (req, res, next) => contributionsRouter(req, res, next));
app.use('/api/events/:eventId/expenses', (req, res, next) => expensesRouter(req, res, next));
app.use('/api/events/:eventId/report', (req, res, next) => reportsRouter(req, res, next));

async function start() {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
