const userAuthMiddleware = (req, res, next) => {
    if (req.user.role !== 'user') {
        return res.status(403).json({ message: 'Acceso denegado. Solo usuarios pueden realizar esta acción.' });
    }
    next();
};

module.exports = userAuthMiddleware;