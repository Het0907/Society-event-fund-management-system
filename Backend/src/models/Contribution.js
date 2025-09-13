import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema(
  {
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    member_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true, index: true },
    attendees: { type: Number, required: true, min: 0 },
    amount_paid: { type: Number, required: true, min: 0 },
    payment_date: { type: Date, required: true }
  },
  { timestamps: true }
);

contributionSchema.index({ event_id: 1, member_id: 1 });

export const Contribution = mongoose.model('Contribution', contributionSchema);

