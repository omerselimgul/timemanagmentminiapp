const { Schema, model } = require('mongoose');

const entrySchema = new Schema({
  userId: { type: String, required: true, index: true },
  date: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  cat: {
    type: String,
    required: true,
    enum: ['iş', 'kişisel', 'sağlık', 'sosyal', 'öğrenme', 'diğer'],
  },
  min: { type: Number, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

entrySchema.index({ userId: 1, date: 1 });

module.exports = model('Entry', entrySchema);
