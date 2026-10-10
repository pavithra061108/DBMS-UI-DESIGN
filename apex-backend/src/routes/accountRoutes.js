const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, accountController.getAccounts);

// THIS WAS MISSING: The route to create the new account!
router.post('/create', verifyToken, accountController.createAccount);

module.exports = router;