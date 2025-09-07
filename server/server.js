const exp = require('express');
const cors = require('cors');
require('dotenv').config();
const connect = require('./config/db');

const app = exp();
const PORT = process.env.PORT || 5000;

// Environment-based CORS configuration
const getAllowedOrigins = () => {
  if (process.env.NODE_ENV === 'production') {
    return ['https://pmr-mu-fawn.vercel.app'];
  }
  return ['http://localhost:5173', 'http://localhost:3000'];
};

// Middleware
app.use(cors({
  origin: getAllowedOrigins(),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
// app.use(exp.json());
app.use(exp.json({ limit: "10mb" })); // allow up to 10MB JSON payloads
app.use(exp.urlencoded({ limit: "10mb", extended: true }));

// Routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// Report routes
app.use('/api/report', require('./routes/reportroute'));

// Connect DB, then start server
connect().then(() => {
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
});
