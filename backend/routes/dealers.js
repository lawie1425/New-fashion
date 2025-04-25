const express = require('express');
const router = express.Router();
const Dealer = require('../models/Dealer');

router.get('/', async (req, res) => {
    try {
        const dealers = await Dealer.find();
        res.json(dealers);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;