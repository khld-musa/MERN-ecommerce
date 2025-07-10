const User = require('../models/user');

// Add or update cart item
exports.addToCart = async (req, res) => {
    const user = await User.findById(req.user.id);
    const { product, name, price, image, stock, quantity } = req.body;

    const itemIndex = user.cart.findIndex(i => i.product.toString() === product);

    if (itemIndex > -1) {
        user.cart[itemIndex].quantity = quantity;
    } else {
        user.cart.push({ product, name, price, image, stock, quantity });
    }

    await user.save();
    res.status(200).json({ success: true, cart: user.cart });
};

// Get cart
exports.getCart = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, cart: user.cart });
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(i => i.product.toString() !== req.params.productId);
    await user.save();
    res.status(200).json({ success: true, cart: user.cart });
};

// Clear cart
exports.clearCart = async (req, res) => {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();
    res.status(200).json({ success: true });
};
