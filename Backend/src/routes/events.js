import express from 'express';
import { Event } from '../models/Event.js';

export const eventsRouter = express.Router();

eventsRouter.get('/', async (_req, res) => {
  try {
    const events = await Event.find({}).sort({ event_year: -1, event_name: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

eventsRouter.get('/grouped-by-year', async (_req, res) => {
  const events = await Event.aggregate([
    { $sort: { event_year: -1, event_name: 1 } },
    { $group: { _id: '$event_year', events: { $push: '$$ROOT' } } },
    { $project: { _id: 0, year: '$_id', events: 1 } },
    { $sort: { year: -1 } }
  ]);
  res.json(events);
});

eventsRouter.post('/', async (req, res) => {
  try {
    const created = await Event.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

eventsRouter.put('/:id', async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Event not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

eventsRouter.delete('/:id', async (req, res) => {
  const deleted = await Event.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Event not found' });
  res.json({ ok: true });
});

