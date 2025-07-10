const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart, clearCart } = require('../controllers/cartController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.route('/cart').get(isAuthenticatedUser, getCart);
router.route('/cart').post(isAuthenticatedUser, addToCart);
router.route('/cart/:productId').delete(isAuthenticatedUser, removeFromCart);
router.route('/cart').delete(isAuthenticatedUser, clearCart);

module.exports = router;
