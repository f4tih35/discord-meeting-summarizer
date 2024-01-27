const fs = require('node:fs');
const path = require('node:path');
const {Client, Collection, GatewayIntentBits} = require('discord.js');
const {token} = require('./config.json');

const client = new Client({intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds]});
const SQLite = require("better-sqlite3");
const sql = new SQLite("./db.sqlite");

client.on("ready", () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);

  const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'entities';").get();
  if (!table['count(*)']) {
    sql.prepare("CREATE TABLE entities (id TEXT PRIMARY KEY, sound_file_path TEXT, text_file_path TEXT);").run();
    sql.prepare("CREATE UNIQUE INDEX idx_entities_id ON entities (id);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
  }
});

client.voiceConnections = new Map();
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(token);