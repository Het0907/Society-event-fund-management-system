import { Contribution } from '../models/Contribution.js';
import { Expense } from '../models/Expense.js';
import mongoose from 'mongoose';

export async function getEventSummary(eventId) {
  const [collectionsAgg, expensesAgg] = await Promise.all([
    Contribution.aggregate([
      { $match: { event_id: new mongoose.Types.ObjectId(eventId) } },
      { $group: { _id: null, total: { $sum: '$amount_paid' } } }
    ]),
    Expense.aggregate([
      { $match: { event_id: new mongoose.Types.ObjectId(eventId) } },
      { $group: { _id: null, total: { $sum: '$amount_paid' } } }
    ])
  ]);

  const totalCollections = collectionsAgg[0]?.total || 0;
  const totalExpenses = expensesAgg[0]?.total || 0;
  const surplus = totalCollections - totalExpenses;

  return { totalCollections, totalExpenses, surplus };
}

