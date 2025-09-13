import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true, trim: true },
    house_number: { type: String, required: true, trim: true, index: true },
  contact_number: { type: String, required: false, trim: true }
  },
  { timestamps: true }
);

memberSchema.index({ house_number: 1 }, { unique: true });

export const Member = mongoose.model('Member', memberSchema);

