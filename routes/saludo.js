//saludo.js
const express = require("express");
const router = express.Router();

// Ruta para el saludo
router.get("/saludo", (req, res) => {
    res.status(200).json({
        message: "¡API Pago Servicios Publicos!"
    });
});

module.exports = router;