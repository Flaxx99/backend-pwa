const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ error: "Acceso denegado. No hay token" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Token inválido o expirado" });

        req.user = decoded;
        console.log("Usuario autenticado:", req.user); // ✅ Verifica que `name` está en `req.user`

        next();
    });
};

module.exports = verifyToken;
