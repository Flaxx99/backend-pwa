require("dotenv").config(); // Para cargar variables de entorno
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

// Configurar conexión con MySQL (Usando variables de entorno)
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "soulquest"
});

// Conectar a MySQL
db.connect(err => {
    if (err) {
        console.error("❌ Error de conexión a MySQL:", err.message);
    } else {
        console.log("✅ Conectado a MySQL");
    }
});

// Servidor WebSocket para actualizaciones en tiempo real
const server = app.listen(port, () => console.log(`🚀 Servidor API en http://localhost:${port}`));
const wss = new WebSocket.Server({ server });

wss.on("connection", ws => {
    console.log("📡 Cliente WebSocket conectado");
});

// **Ruta para actualizar datos desde Unity o React**
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

            // Notificar a WebSocket
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ nombre, vida, mana, experiencia, nivel }));
                }
            });
        }
    );
});

// **Ruta para obtener datos del personaje (Usado en Flutter y React)**
app.get("/getCharacter/:id", (req, res) => {
    const { id } = req.params;

    db.query(
        "SELECT * FROM characters WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(result.length > 0 ? result[0] : {}); 
        }
    );
});
