import express from 'express';
import { Contribution } from '../models/Contribution.js';
import { Member } from '../models/Member.js';

export const contributionsRouter = express.Router({ mergeParams: true });

// List contributions for an event
contributionsRouter.get('/', async (req, res) => {
  const { eventId } = req.params;
  const items = await Contribution.find({ event_id: eventId })
    .populate({ path: 'member_id', model: Member, select: 'full_name house_number contact_number' })
    .sort({ payment_date: -1 });
  res.json(items);
});

// Create contribution
contributionsRouter.post('/', async (req, res) => {
  try {
    const { eventId } = req.params;
    const payload = { ...req.body, event_id: eventId };
    const created = await Contribution.create(payload);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
contributionsRouter.put('/:id', async (req, res) => {
  try {
    const updated = await Contribution.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Contribution not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
contributionsRouter.delete('/:id', async (req, res) => {
  const deleted = await Contribution.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Contribution not found' });
  res.json({ ok: true });
});

