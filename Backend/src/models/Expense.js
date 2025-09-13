import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  vendor_name: { type: String, required: true, trim: true },
  description: { type: String, required: false, trim: true },
  amount_paid: { type: Number, required: true, min: 0 },
  payment_date: { type: Date, required: false }
  },
  { timestamps: true }
);

expenseSchema.index({ event_id: 1 });

export const Expense = mongoose.model('Expense', expenseSchema);

