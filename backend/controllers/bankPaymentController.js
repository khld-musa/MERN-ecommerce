const User = require('../models/user');
const Order = require('../models/order');
const path = require('path');
const fs = require('fs');

exports.createBankPaymentOrder = async (req, res) => {
    try {
        // Get order details from form fields
        const { itemsPrice, shippingPrice, taxPrice, totalPrice, shippingInfo, orderItems } = req.body;
        if (!req.files || !req.files.bankStatement) {
            return res.status(400).json({ success: false, message: 'Bank statement image is required.' });
        }
        const bankStatement = req.files.bankStatement;
        const uploadPath = path.join(__dirname, '../uploads/bank_statements', Date.now() + '_' + bankStatement.name);
        await bankStatement.mv(uploadPath);
        // Create order with payment method 'bank' and attach image path
        const order = await Order.create({
            user: req.user._id,
            orderItems: JSON.parse(orderItems),
            shippingInfo: JSON.parse(shippingInfo),
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            paymentInfo: {
                method: 'bank',
                bankStatement: uploadPath.replace(/\\/g, '/')
            },
            paidAt: Date.now(),
            orderStatus: 'Pending Bank Confirmation'
        });
        res.status(201).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
