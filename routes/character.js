const express = require("express");
const router = express.Router();
const db = require("../database");

//
router.post("/updateCharacter", (req, res) => {
    const { user_id, vida, mana, experiencia, nivel } = req.body;

    if (!user_id || vida === undefined || mana === undefined || experiencia === undefined || nivel === undefined) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    const query = `
        INSERT INTO characters (user_id, vida, mana, experiencia, nivel) 
        VALUES (?, ?, ?, ?, ?) 
        ON DUPLICATE KEY UPDATE 
          vida = VALUES(vida), 
          mana = VALUES(mana), 
          experiencia = VALUES(experiencia), 
          nivel = VALUES(nivel)
    `;

    db.query(query, [user_id, vida, mana, experiencia, nivel], (err, result) => {
        if (err) {
            console.error("❌ Error al actualizar el personaje:", err);
            return res.status(500).json({ error: "Error al actualizar el personaje." });
        }
        res.json({ message: "✅ Datos del personaje actualizados correctamente." });
    });
});

module.exports = router;
