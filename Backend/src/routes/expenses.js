import express from 'express';
import { Expense } from '../models/Expense.js';

export const expensesRouter = express.Router({ mergeParams: true });

expensesRouter.get('/', async (req, res) => {
  const { eventId } = req.params;
  const items = await Expense.find({ event_id: eventId }).sort({ payment_date: -1 });
  res.json(items);
});

expensesRouter.post('/', async (req, res) => {
  try {
    const { eventId } = req.params;
    const payload = { ...req.body, event_id: eventId };
    const created = await Expense.create(payload);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

expensesRouter.put('/:id', async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Expense not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

expensesRouter.delete('/:id', async (req, res) => {
  const deleted = await Expense.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Expense not found' });
  res.json({ ok: true });
});

