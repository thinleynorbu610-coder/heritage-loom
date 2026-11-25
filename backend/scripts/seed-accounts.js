const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = new mongoose.Schema({ name: String, email: { type: String, unique: true }, passwordHash: { type: String, select: false }, role: { type: String, enum: ['user', 'seller', 'admin'] } });
const User = mongoose.model('SeedUser', schema, 'users');
const accounts = [
  ['Heritage User', 'user@heritageloom.local', 'UserPass!2026', 'user'],
  ['Heritage Seller', 'seller@heritageloom.local', 'SellerPass!2026', 'seller'],
  ['Heritage Admin', 'admin@heritageloom.local', 'AdminPass!2026', 'admin'],
];
(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://host.docker.internal:27017/heritage_loom');
  for (const [name, email, password, role] of accounts) {
    const passwordHash = await bcrypt.hash(password, 12);
    await User.updateOne({ email }, { $set: { name, email, passwordHash, role } }, { upsert: true });
  }
  console.log('Accounts created or updated');
  await mongoose.disconnect();
})().catch((error) => { console.error(error); process.exit(1); });
