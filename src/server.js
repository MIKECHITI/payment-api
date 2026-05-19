require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;
// Startup checks
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not set in environment. Exiting.');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`🚀 Virtual Wallet API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
