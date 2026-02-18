import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amountPaise: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true, maxlength: 60, index: true },
    description: { type: String, required: true, trim: true, maxlength: 240 },
    date: { type: Date, required: true, index: true },
    idempotencyKey: { type: String, required: true }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

// Enforce idempotent create per user.
expenseSchema.index({ user: 1, idempotencyKey: 1 }, { unique: true });

export const Expense = mongoose.model('Expense', expenseSchema);
