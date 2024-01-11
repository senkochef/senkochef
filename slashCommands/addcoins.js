// addcoins.js
const { Client, Intents, Collection } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
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

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addcoins')
    .setDescription('Fügt einem Mitglied Coins hinzu')
    .addUserOption(option =>
      option.setName('member')
        .setDescription('Das Mitglied, dem Coins hinzugefügt werden sollen')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Die Anzahl der hinzuzufügenden Coins')
        .setRequired(true)
    ),
  async execute(interaction) {
    const member = interaction.options.getMember('member');
    const amount = interaction.options.getInteger('amount');

    // Simuliere das Hinzufügen von Coins zu einem Mitglied
    // Hier solltest du die Logik für das Hinzufügen von Coins zu einem Benutzer implementieren
    bot.coinsData[member.id] = (bot.coinsData[member.id] || 0) + amount;
    fs.writeFileSync('coins.json', JSON.stringify(bot.coinsData, null, 2));

    return interaction.reply(`${amount} Coins wurden zu ${member.toString()} hinzugefügt.`);
  },
};
