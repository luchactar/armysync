const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

const SECRET = "CAMBIAR_POR_CLAVE_SECRETA";

const DATABASE_FILE = "database.json";

let database = {};

// Cargar base de datos si existe
if (fs.existsSync(DATABASE_FILE)) {
    database = JSON.parse(fs.readFileSync(DATABASE_FILE));
}

// Guardar base de datos
function saveDatabase() {
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(database, null, 2));
}

// Discord actualiza usuario
app.post("/update-user", (req, res) => {

    const { secret, username, mainRole, divisions } = req.body;

    if (secret !== SECRET) {
        return res.status(403).send("No autorizado");
    }

    database[username] = {
        mainRole: mainRole,
        divisions: divisions
    };

    saveDatabase();

    console.log("Actualizado:", username);

    res.send("OK");
});

// Roblox consulta team
app.get("/get-team/:username", (req, res) => {

    const user = database[req.params.username];

    if (!user) {
        return res.json({ team: "Civil" });
    }

    if (user.mainRole) {
        return res.json({ team: "Ejercito" });
    }

    if (user.divisions && user.divisions.length > 0) {
        const random = user.divisions[Math.floor(Math.random() * user.divisions.length)];
        return res.json({ team: random });
    }

    return res.json({ team: "Civil" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor funcionando en puerto " + PORT);
});
