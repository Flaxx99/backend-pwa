require("dotenv").config(); // Cargar variables del .env
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const WebSocket = require("ws");

// Configurar Express
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // Permitir JSON en el cuerpo de las solicitudes

// Configurar conexión con MySQL (Usando el host correcto)
const db = mysql.createConnection({
    host: process.env.DB_HOST,      
    user: process.env.DB_USER,      
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,  
    port: process.env.DB_PORT || 3306, 
    connectTimeout: 10000 
});

// Conectar a MySQL
db.connect(err => {
    if (err) {
        console.error("❌ Error de conexión a MySQL:", err.message);
    } else {
        console.log("✅ Conectado a MySQL en Railway");
    }
});

// ✅ **Nueva Ruta para Verificar si el Servidor Está Corriendo**
app.get("/", (req, res) => {
    res.send("✅ API de SoulQuest está funcionando");
});

// ✅ **Ruta para obtener datos del personaje**
app.get("/getCharacter/:id", (req, res) => {
    const { id } = req.params;

    db.query(
        "SELECT * FROM characters WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.length > 0) {
                res.json(result[0]); // Devuelve el personaje encontrado
            } else {
                res.status(404).json({ error: "Personaje no encontrado" });
            }
        }
    );
});

// ✅ **Ruta para actualizar datos desde Unity o React**
app.post("/updateCharacter", (req, res) => {
    const { nombre, vida, mana, experiencia, nivel } = req.body;

    if (!nombre || vida === undefined || mana === undefined || experiencia === undefined || nivel === undefined) {
        return res.status(400).json({ error: "Faltan datos en la solicitud" });
    }

    db.query(
        "INSERT INTO characters (nombre, vida, mana, experiencia, nivel) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE vida = ?, mana = ?, experiencia = ?, nivel = ?",
        [nombre, vida, mana, experiencia, nivel, vida, mana, experiencia, nivel],
        (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "✅ Datos actualizados" });
        }
    );
});

// Servidor WebSocket
const server = app.listen(port, () => console.log(`🚀 Servidor API en http://localhost:${port}`));
const wss = new WebSocket.Server({ server });

wss.on("connection", ws => {
    console.log("📡 Cliente WebSocket conectado");
});
