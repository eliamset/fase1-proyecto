// models/User.js
// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscription: { type: String, default: 'free' } // 👈 ahora es un string
}, { timestamps: true });



module.exports = mongoose.model('User', UserSchema);







module.exports = mongoose.model('User', UserSchema);
