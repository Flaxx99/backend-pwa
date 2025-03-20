const mysql = require("mysql2");

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
        console.error("Error de conexión a MySQL:", err.message);
    } else {
        console.log("Conectado a MySQL en Railway");
    }
});

module.exports = db;