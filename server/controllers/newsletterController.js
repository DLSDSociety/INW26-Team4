const Subscriber = require('../models/Subscriber');

// POST /api/newsletter/subscribe   (public)
exports.subscribe = async (req, res) => {
  try {
    const { email, source } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.active) {
        return res.status(200).json({ message: 'You are already subscribed' });
      }
      existing.active = true;
      await existing.save();
      return res.json({ message: 'Welcome back — subscription reactivated' });
    }

    await Subscriber.create({ email, source });
    res.status(201).json({ message: 'Thanks for subscribing!' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(200).json({ message: 'You are already subscribed' });
    }
    res.status(500).json({ message: err.message });
  }
};

// GET /api/newsletter/subscribers   (admin)
exports.list = async (_req, res) => {
  const subs = await Subscriber.find().sort('-createdAt');
  res.json(subs);
};