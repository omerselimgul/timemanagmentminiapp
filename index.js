if (process.env.NODE_ENV !== 'production') require('dotenv').config();
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'UNDEFINED');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', require('./src/routes/auth'));
app.use('/entries', require('./src/routes/entries'));

app.get('/health', (_, res) => res.json({ ok: true }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'server_error' });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`API running on :${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB bağlantı hatası:', err);
    process.exit(1);
  });
