const { Client, Intents, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId, guildId } = require('./config.json');
const fs = require('fs');
 
const bot = new Client({
    restTimeOffset: 0,
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_PRESENCES
    ]
});
 
 
bot.commands = new Collection();
 
// Normale Commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
 
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}
 
const slashCommands = [];
const path = require('path');
const slashCommandFiles = fs.readdirSync(path.join(__dirname, 'slashCommands')).filter(file => file.endsWith('.js'));
 
for (const file of slashCommandFiles) {
    const slashCommand = require(`./slashCommands/${file}`);
    bot.commands.set(slashCommand.data.name, slashCommand);
    slashCommands.push(slashCommand.data);
}
 
 
// Event für normale Commands
bot.on('messageCreate', message => {
    if (!message.content.startsWith('!') || message.author.bot) return;
 
    const args = message.content.slice('!'.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
 
    const command = bot.commands.get(commandName);
 
    if (!command) return;
 
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Es gab einen Fehler beim Ausführen dieses Befehls.');
    }
});
 
// Event für Slash Commands
bot.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
 
    const command = bot.commands.get(interaction.commandName);
 
    if (!command) return;
 
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply('Es gab einen Fehler beim Ausführen dieses Befehls.');
    }
});
 
// Setze Slash Commands
const rest = new REST({ version: '9' }).setToken(token);
 
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
 
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: slashCommands },
        );
 
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
 
bot.login(token);