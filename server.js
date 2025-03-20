require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // Servir archivos estáticos desde `public/`

//Importar las rutas
const paginaRoutes = require("./routes/pagina");
const characterRoutes = require("./routes/character");
const authRoutes = require("./routes/auth");  //Agregar autenticación
const verifyToken = require("./middleware/authMiddleware"); //Middleware JWT

//Usar rutas en la API
app.use("/", paginaRoutes);
app.use("/api/character", characterRoutes);
app.use("/api/auth", authRoutes); //Rutas de autenticación

//Ruta protegida de prueba
app.get("/api/protegido", verifyToken, (req, res) => {
    res.json({ message: "Bienvenido a la ruta protegida!", user: req.user });
});

app.listen(port, () => console.log(`🚀 Servidor API en http://localhost:${port}`));
