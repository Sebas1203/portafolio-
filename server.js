const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "produccion",
    password: "Sl1000307432**",
    port: 5432,
});

app.post("/registro", async (req, res) => {
    const { cartao, tipo, mesa } = req.body;

    try {
        await pool.query(
            "INSERT INTO registros (cartao, tipo, mesa) VALUES ($1, $2, $3)",
            [cartao, tipo, mesa]
        );
        res.send("Registro exitoso");
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao guardar registo" });
    }
});

app.get("/usuarios/:cartao", async (req, res) => {
    const { cartao } = req.params;

    try {
        const resultado = await pool.query(
            "SELECT * FROM usuarios WHERE cartao = $1",
            [cartao]
        );
        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: "Colaborador não encontrado" });
        }
        res.json(resultado.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro na base de dados" });
    }
});

app.listen(3000, () => {
    console.log("Servidor a correr em http://localhost:3000");
});