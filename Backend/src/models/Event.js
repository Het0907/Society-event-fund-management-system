import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    event_name: { type: String, required: true, trim: true },
    event_year: { type: Number, required: true, index: true }
  },
  { timestamps: true }
);

eventSchema.index({ event_name: 1, event_year: 1 }, { unique: true });

export const Event = mongoose.model('Event', eventSchema);

