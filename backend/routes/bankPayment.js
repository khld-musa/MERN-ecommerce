const express = require('express');
const router = express.Router();
const { createBankPaymentOrder } = require('../controllers/bankPaymentController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.post('/bank-payment', isAuthenticatedUser, createBankPaymentOrder);

module.exports = router;
