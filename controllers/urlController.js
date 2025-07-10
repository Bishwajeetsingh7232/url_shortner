import Url from '../models/Url.js';

const BASE_URL = 'https://url-shortner-roik.onrender.com';

export const shortenUrl = async (req, res, next, utils) => {
  try {
    let { url, expiry } = req.body;

    url = utils.formatUrl(url);
    if (!utils.isValidHttpUrl(url)) {
      const err = new Error('Invalid URL format');
      err.statusCode = 400;
      throw err;
    }

    const existing = await Url.findOne({ originalUrl: url });
    if (existing) {
      return res.json({ shortUrl: `${BASE_URL}/${existing.code}` });
    }

    let expiryDate;
    if (expiry) {
      if (!utils.isValidFutureDate(expiry)) {
        const err = new Error('Invalid expiry date format. Must be a valid future date.');
        err.statusCode = 400;
        throw err;
      }
      expiryDate = new Date(expiry);
    } else {
      expiryDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
    }

    const code = utils.shortid.generate();
    const newUrl = new Url({
      originalUrl: url,
      code,
      createdAt: new Date(),
      expiry: expiryDate,
    });

    await newUrl.save();

    res.status(201).json({
      shortUrl: `${BASE_URL}/${code}`,
      expiresAt: expiryDate.toISOString(),
    });
  } catch (err) {
    next(err);
  }
};

export const redirectUrl = async (req, res, next) => {
  try {
    const record = await Url.findOne({ code: req.params.code });

    if (!record) return res.status(404).json({ error: 'Not found' });

    if (record.expiry && record.expiry < new Date()) {
      return res.status(410).json({ error: 'Link expired' });
    }

    record.clicks += 1;
    await record.save();

    return res.redirect(record.originalUrl);
  } catch (err) {
    next(err);
  }
};
