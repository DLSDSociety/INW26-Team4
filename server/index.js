require('dotenv').config();

const connectDB = require('./config/db');
const app = require('./app');



/**
 * server.js — UPDATED for Week 3.
 *
 * Week 2: server.js built the whole Express app inline.
 * Week 3: the app moved into app.js (so Supertest can import it).
 *         server.js now only:
 *           1. connects to MongoDB Atlas
 *           2. starts the HTTP server
 */
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `✅  Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});
