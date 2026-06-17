const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
      match: [/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [100, 'Email cannot exceed 100 characters'],
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      maxlength: [128, 'Password cannot exceed 128 characters'],
      select: false
    },
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// Check if account is locked
userSchema.virtual('isLocked').get(function () {
  return this.lockUntil && this.lockUntil > Date.now();
});

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password + handle login attempts
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Block if account is locked
  if (this.isLocked) {
    const minutesLeft = Math.ceil((this.lockUntil - Date.now()) / 60000);
    throw new Error(`Account locked. Try again in ${minutesLeft} minute(s).`);
  }

  const isMatch = await bcrypt.compare(enteredPassword, this.password);

  if (!isMatch) {
    this.loginAttempts += 1;

    // Lock account after 5 failed attempts for 15 minutes
    if (this.loginAttempts >= 5) {
      this.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      this.loginAttempts = 0;
    }
    await this.save();
    return false;
  }

  // Reset on successful login
  if (this.loginAttempts > 0) {
    this.loginAttempts = 0;
    this.lockUntil = null;
    await this.save();
  }

  return true;
};

module.exports = mongoose.model('User', userSchema);