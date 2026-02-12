const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

const TOKEN = process.env.DISCORD_TOKEN;
const API = "https://armysync.onrender.com";
const SECRET = "EAMODDED";

const divisionRoles = [
    "Comandos",
    "Artilleria",
    "Infanteria"
];

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {

    const username = newMember.displayName;

    const hasMainRole = newMember.roles.cache.some(r => r.name === "Ejercito");

    let divisions = [];

    divisionRoles.forEach(role => {
        if (newMember.roles.cache.some(r => r.name === role)) {
            divisions.push(role);
        }
    });

    await axios.post(API, {
        secret: SECRET,
        username: username,
        mainRole: hasMainRole,
        divisions: divisions
    });

    console.log("Sincronizado:", username);
});

client.login(TOKEN);
