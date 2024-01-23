const router = require('express').Router();
const userRoutes = require('./userRoutes');
const chatRoutes = require('./chat');

router.use('/users', userRoutes);
router.use('/chat', chatRoutes);

module.exports = router;
