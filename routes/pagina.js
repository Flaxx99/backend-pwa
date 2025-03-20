const express = require("express");
const router = express.Router();
const path = require("path");

// ✅ **Ruta para servir la Landing Page**
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = router;
