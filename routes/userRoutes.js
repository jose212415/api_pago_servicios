//userRoutes.js
const express = require('express');
const { registerRequestUser, loginUser, searchInvoice, updateInvoiceStatus, searchPaidInvoices  } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const userAuthMiddleware = require('../middleware/userMiddleware');

const router = express.Router();

// Rutas para usuarios
router.post('/request-register', registerRequestUser);
router.post('/login', loginUser);
router.post('/search-invoice', authMiddleware, userAuthMiddleware, searchInvoice);
router.post('/update-invoice-status', authMiddleware, userAuthMiddleware, updateInvoiceStatus);
router.post('/search-paid-invoices', authMiddleware, userAuthMiddleware, searchPaidInvoices);

module.exports = router;
