const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User model — UPDATED for Week 3 (Authentication).
 *
 * Week 2 only defined the schema. Week 3 adds:
 *   - a pre-save hook that bcrypt-hashes the password (Task #1)
 *   - a matchPassword() instance method used by login (Task #2)
 *
 * The field is still called `passwordHash` to match the plan. The
 * register controller assigns the PLAIN password to it, and the
 * pre-save hook below replaces it with the bcrypt hash.
 */
// Subdocument for a saved address.
// Each address has its own _id so the user can update/delete by id.
const addressSchema = new mongoose.Schema({
  label:      { type: String, default: 'Home' },   // 'Home', 'Office', ...
  fullName:   { type: String, required: true },
  phone:      { type: String, required: true },
  address:    { type: String, required: true },
  city:       { type: String, required: true },
  state:      { type: String, default: '' },
  postalCode: { type: String, required: true },
  isDefault:  { type: Boolean, default: false },
}, { _id: true, timestamps: true });




const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      // Never returned by default queries. Login must explicitly
      // .select('+passwordHash').
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Role must be either "user" or "admin"',
      },
      default: 'user',
    },

    
  // NEW — Cloudinary URL (re-use the Week 5 uploadMiddleware)
  avatar:   { type: String, default: '' },

  // NEW — address book
  addresses: [addressSchema],
  
  wishlist: [
  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: [] },
],


  // NEW — soft delete flag; null means active
  deletedAt: { type: Date, default: null, index: true },
}, 

  {
    timestamps: true,
  }
);






// ── Pre-save: hash the password (Task #1) ───────────────────────
// Runs before .save() / .create(). Only re-hashes when the password
// field actually changed, so updating name/email won't double-hash.
userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// ── Instance method: compare a candidate password (Task #2) ─────
userSchema.methods.matchPassword = async function (candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

//userSchema.index({ email: 1 }, { unique: true });


module.exports = mongoose.model('User', userSchema);
