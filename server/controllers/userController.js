const User = require('../models/User');

// ───────────────────────────────────────────────────────────
// PUT /api/users/profile   (protect)
// Body: { name?, email?, avatar? }
// ───────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    // If email is changing, make sure no other user owns it
    if (email) {
      const taken = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: req.user._id },
      });
      if (taken) {
        return res.status(409).json({ message: 'Email already in use' });
      }
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name)   user.name   = name;
    if (email)  user.email  = email.toLowerCase();
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, avatar: user.avatar,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ───────────────────────────────────────────────────────────
// PUT /api/users/password   (protect)
// Body: { currentPassword, newPassword }
// ───────────────────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'currentPassword and newPassword are required',
      });
    }
    if (newPassword.length < 6) {
      return res.status(422).json({
        message: 'New password must be at least 6 characters',
      });
    }

    // password is select:false on the schema — must opt in
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ok = await user.matchPassword(currentPassword);
    if (!ok) return res.status(401).json({ message: 'Current password is wrong' });

    user.password = newPassword;   // pre-save hook re-hashes
    await user.save();

    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ───────────────────────────────────────────────────────────
// GET /api/users/addresses   (protect)
// ───────────────────────────────────────────────────────────
exports.listAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ───────────────────────────────────────────────────────────
// POST /api/users/addresses   (protect)
// Body: { label, fullName, phone, address, city, state?, postalCode, isDefault? }
// ───────────────────────────────────────────────────────────
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // If this is the first address OR marked default, un-default all others
    if (req.body.isDefault || user.addresses.length === 0) {
      user.addresses.forEach((a) => { a.isDefault = false; });
      req.body.isDefault = true;
    }

    user.addresses.push(req.body);
    await user.save();
    res.status(201).json(user.addresses);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ───────────────────────────────────────────────────────────
// PUT /api/users/addresses/:addressId   (protect)
// ───────────────────────────────────────────────────────────
exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ message: 'Address not found' });

    // If switching default ON, clear it on the others first
    if (req.body.isDefault === true) {
      user.addresses.forEach((a) => { a.isDefault = false; });
    }

    Object.assign(addr, req.body);
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ───────────────────────────────────────────────────────────
// DELETE /api/users/addresses/:addressId   (protect)
// ───────────────────────────────────────────────────────────
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ message: 'Address not found' });

    const wasDefault = addr.isDefault;
    addr.deleteOne();

    // If we just removed the default, promote the first remaining one
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ───────────────────────────────────────────────────────────
// DELETE /api/users/account   (protect)
// Body: { currentPassword }   — soft delete
// ───────────────────────────────────────────────────────────
exports.deleteAccount = async (req, res) => {
  try {
    const { currentPassword } = req.body;
    if (!currentPassword) {
      return res.status(400).json({ message: 'currentPassword is required' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ok = await user.matchPassword(currentPassword);
    if (!ok) return res.status(401).json({ message: 'Password is wrong' });

    // Soft delete — orders stay intact for the admin reports
    user.deletedAt = new Date();
    user.email     = `deleted_${user._id}@removed.local`;
    user.name      = 'Deleted User';
    await user.save();

    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

