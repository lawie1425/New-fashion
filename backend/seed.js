try {
    const mongoose = require('mongoose');
    console.log('Loaded mongoose');
    const bcrypt = require('bcryptjs');
    console.log('Loaded bcryptjs');
    const dotenv = require('dotenv');
    console.log('Loaded dotenv');
    const Admin = require('./models/admin');
    console.log('Loaded Admin model');
    const Dealer = require('./models/Dealer');
    console.log('Loaded Dealer model');
    const Payment = require('./models/payment');
    console.log('Loaded Payment model');
    const Product = require('./models/product');
    console.log('Loaded Product model');
    const User = require('./models/User');
    console.log('Loaded User model');
    const Cart = require('./models/cart');
    console.log('Loaded Cart model');
    const Order = require('./models/order');
    console.log('Loaded Order model');
} catch (err) {
    console.error('Module load error:', err.message);
    process.exit(1);
}