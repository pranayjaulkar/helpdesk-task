const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const { ROLES } = require('../utils/constants');

const [name, email, password] = process.argv.slice(2);

if (!name || !email || !password) {
  console.log('Usage: npm run create-admin -- <name> <email> <password>');
  process.exit(1);
}

(async () => {
  try {
    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      existing.role = ROLES.ADMIN;
      await existing.save();
      console.log(`${email} promoted to admin`);
    } else {
      await User.create({ name, email, password, role: ROLES.ADMIN });
      console.log(`Admin ${email} created`);
    }
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
