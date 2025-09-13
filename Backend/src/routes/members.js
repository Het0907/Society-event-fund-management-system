import express from 'express';
import { Member } from '../models/Member.js';

export const membersRouter = express.Router();

membersRouter.get('/', async (_req, res) => {
  try {
    const members = await Member.find({}).sort({ house_number: 1 });
    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

membersRouter.post('/', async (req, res) => {
  try {
    const created = await Member.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

membersRouter.put('/:id', async (req, res) => {
  try {
    const updated = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Member not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

membersRouter.delete('/:id', async (req, res) => {
  const deleted = await Member.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Member not found' });
  res.json({ ok: true });
});

