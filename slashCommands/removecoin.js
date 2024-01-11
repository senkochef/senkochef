// removecoin.js

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removecoin')
    .setDescription('Entfernt Coins von einem Mitglied')
    .addUserOption(option =>
      option.setName('member')
        .setDescription('Das Mitglied, von dem Coins entfernt werden sollen')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Die Anzahl der zu entfernenden Coins')
        .setRequired(true)
    ),
  async execute(interaction) {
    // Hier fügst du deine Logik zum Entfernen von Coins ein
    // Beispiel: const member = interaction.options.getMember('member');
    // const amount = interaction.options.getInteger('amount');
    // coinsManager.removeCoins(member.id, amount);

    return interaction.reply(`Coins wurden erfolgreich entfernt.`);
  },
};
