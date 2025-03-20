const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../supabase"); // Importamos el cliente de Supabase
require("dotenv").config();

const router = express.Router();

// 🔹 Registro de usuario
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    // Verificar que todos los campos estén presentes
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    // Verificar si el usuario ya existe en Supabase
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

    if (error && error.code !== "PGRST116") {
        return res.status(500).json({ error: "Error al verificar el correo" });
    }

    if (data) {
        return res.status(400).json({ error: "El usuario ya está registrado" });
    }

    // Encriptar la contraseña antes de insertarla
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: "Error al encriptar la contraseña" });

        // Guardar el nuevo usuario en Supabase
        const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert([
                { name, email, password: hashedPassword }
            ])
            .single();

        if (insertError) {
            return res.status(500).json({ error: "Error al registrar usuario" });
        }

        res.status(201).json({ message: "Usuario registrado con éxito" });
    });
});

// 🔑 Inicio de sesión
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Verificar que el correo y la contraseña estén presentes
    if (!email || !password) {
        return res.status(400).json({ error: "Correo y contraseña son requeridos" });
    }

    // Buscar al usuario en Supabase
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

    if (error || !data) {
        return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const user = data;

    // Comparar la contraseña ingresada con la almacenada en Supabase
    bcrypt.compare(password, user.password, (err, validPassword) => {
        if (err) return res.status(500).json({ error: "Error al comparar las contraseñas" });
        if (!validPassword) return res.status(401).json({ error: "Contraseña incorrecta" });

        // Generar JWT Token
        const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({
            message: "Inicio de sesión exitoso",
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    });
});

module.exports = router;
