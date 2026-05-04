const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  userId: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('User', userSchema);
