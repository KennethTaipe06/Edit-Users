const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: String,
  username: String,
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  address: String,
  phone: String,
  image: {
    data: Buffer,
    contentType: String
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
