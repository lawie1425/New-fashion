const express = require('express');
const router = express.Router();
const Order = require('/Projects/New fashion/backend/models/order');
const Cart = require('/Projects/New fashion/backend/models/cart');

router.post('/', async (req, res) => {
    const { userId, fullName, email, phone, shippingAddress, paymentMethod, transactionId, ordersByDealer, total } = req.body;
    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        const order = new Order({
            fullName,
            email,
            phone,
            shippingAddress,
            paymentMethod,
            ordersByDealer,
            total,
            transactionId
        });

        await order.save();
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;