const express = require('express');
const router = express.Router();
const Cart = require('d:/Projects/New fashion/backend/models/cart');
const Product = require('d:/Projects/New fashion/backend/models/product');

router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
        res.json(cart || { userId: req.params.userId, items: [] });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/:userId/add', async (req, res) => {
    const { productId, size, quantity, dealerId } = req.body;
    try {
        const product = await Product.findOne({ id: productId });
        if (!product) return res.status(404).json({ error: 'Product not found' });

        let cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) {
            cart = new Cart({ userId: req.params.userId, items: [] });
        }

        const existingItem = cart.items.find(item => item.productId === productId && item.size === size);
        if (existingItem) {
            return res.status(400).json({ error: 'Item already in cart' });
        }

        cart.items.push({ productId, size, quantity, dealerId: dealerId || product.dealerId });
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/:userId/clear', async (req, res) => {
    try {
        await Cart.deleteOne({ userId: req.params.userId });
        res.json({ message: 'Cart cleared' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;