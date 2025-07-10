import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import shortid from 'shortid';
import { connectDB } from './config/db.js';
import { shortenUrl, redirectUrl } from './controllers/urlController.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

const rateLimitWindow = 15 * 60 * 1000; // ab tum kuch mt krna
const maxRequests = 100;
const ipRecords = new Map();

app.use((req, res, next) => {
  const ip = req.ip;
  const now = Date.now();

  if (!ipRecords.has(ip)) ipRecords.set(ip, []);
  const timestamps = ipRecords.get(ip).filter(ts => now - ts < rateLimitWindow);

  if (timestamps.length >= maxRequests) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  timestamps.push(now);
  ipRecords.set(ip, timestamps);
  next();
});

function isValidHttpUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidFutureDate(dateStr) {
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && date > new Date();
}

function formatUrl(rawUrl) {
  let formatted = rawUrl.trim();
  if (!/^https?:\/\//i.test(formatted)) {
    formatted = 'https://' + formatted;
  }
  try {
    const parsed = new URL(formatted);
    parsed.hostname = parsed.hostname.toLowerCase();
    parsed.pathname = parsed.pathname.replace(/\/$/, '');
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

app.post('/shorten', async (req, res, next) => {
  try {
    await shortenUrl(req, res, next, { isValidHttpUrl, isValidFutureDate, formatUrl, shortid });
  } catch (err) {
    next(err);
  }
});

app.get('/:code', async (req, res, next) => {
  try {
    await redirectUrl(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
