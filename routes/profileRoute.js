const express = require('express');
const multer = require('multer');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMidleware');

const router = express.Router();

// ✅ Multer Setup (Store in memory, then convert to Buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Update Profile Image (Avatar)
router.put('/updateAvatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // ✅ Find User & Update Avatar
    const updatedUser = await User.findByIdAndUpdate(userId, {
      avatar: {
        data: req.file.buffer,         // Store image as Buffer
        contentType: req.file.mimetype // Store MIME type (e.g., "image/png")
      }
    }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile image updated successfully', avatar: updatedUser.avatar });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile image', error: error.message });
  }
});

router.get('/getAvatar', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      if (!user || !user.avatar) {
        return res.status(404).json({ message: 'Avatar not found' });
      }
      // Convert Buffer to Base64 for frontend
      const base64Image = `data:${user.avatar.contentType};base64,${user.avatar.data.toString('base64')}`;
  
      res.status(200).json({ avatar: base64Image });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving profile image', error: error.message });
    }
});
  
module.exports = router;