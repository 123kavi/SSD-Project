const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  Name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  ProfilePic: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: 0
}
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  try {
    // Only hash the password if it's been modified
    if (!this.isModified('password')) {
      return next();
    }

    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);
