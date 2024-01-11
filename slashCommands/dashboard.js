// dashboard.js

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dashboard')
    .setDescription('Zeigt die Rangliste der Mitglieder an'),
  async execute(interaction) {
    // Verwende client.coinsData, um auf die Coins-Daten zuzugreifen
    const coinsData = client.coinsData;

    // Sortiere die Rangliste nach absteigender Reihenfolge der Coins und begrenze sie auf die ersten 10 Einträge
    const sortedLeaderboard = Object.entries(coinsData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const leaderboardEmbed = new MessageEmbed()
      .setTitle('Rangliste der Top 10 Mitglieder')
      .setDescription('Hier ist die Liste der Mitglieder mit den meisten Coins:');

    // Füge die Informationen der Rangliste zum Embed hinzu
    sortedLeaderboard.forEach((entry, index) => {
      const [userId, coins] = entry;
      const member = interaction.guild.members.cache.get(userId);

      // Überprüfe, ob es sich um einen Bot handelt
      const isBot = member.user.bot;

      leaderboardEmbed.addField(
        `${index + 1}. ${member.toString()} (Bot: ${isBot ? 'Ja' : 'Nein'})`,
        `Coins: ${coins}`
      );
    });

    return interaction.reply({ embeds: [leaderboardEmbed] });
  },
};
