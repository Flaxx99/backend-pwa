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

// Servidor WebSocket
const server = app.listen(port, () => console.log(`🚀 Servidor API en http://localhost:${port}`));
const wss = new WebSocket.Server({ server });

wss.on("connection", ws => {
    console.log("📡 Cliente WebSocket conectado");
});
