//adminRoutes.js
const express = require('express');
const { getPendingRequests, resolveRequest, registerAdmin, getListUsers, registerInvoice, getServices, getAllInvoices, getListMeters} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminAuthMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Ruta para administador
router.post('/register-admin', authMiddleware, adminAuthMiddleware, registerAdmin);
router.post('/register-admin-no-secure', registerAdmin); // Ruta temporal para primer Administrador
router.get('/list-pending-requests', authMiddleware, adminAuthMiddleware, getPendingRequests);
router.post('/resolve-request', authMiddleware, adminAuthMiddleware, resolveRequest);
router.get('/list-users', authMiddleware, adminAuthMiddleware, getListUsers);
router.get('/list-services', authMiddleware, adminAuthMiddleware, getServices);
router.get('/list-invoices', authMiddleware, adminAuthMiddleware, getAllInvoices);
router.get('/list-meters', authMiddleware, adminAuthMiddleware, getListMeters);
router.post('/register-invoice', authMiddleware, adminAuthMiddleware, registerInvoice);

module.exports = router;
