const express = require("express");
const router = express.Router();

// Ruta para el saludo
router.get("/saludo", (req, res) => {
    res.status(200).json({
        message: "¡Bienvenido a nuestra API!",
    });
});

module.exports = router;
