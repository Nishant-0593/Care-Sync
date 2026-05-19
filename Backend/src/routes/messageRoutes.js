const express = require('express');
const { getChatUsers, getConversation, searchUsers, addContact } = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// All message routes require authentication
router.use(protect);

router.get('/users', getChatUsers);
router.get('/search', searchUsers);
router.post('/contacts/:userId', addContact);
router.get('/:userId', getConversation);

module.exports = router;
