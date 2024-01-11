// slashCommands/assignrole.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('assignrole')
    .setDescription('Gibt dem Benutzer die angegebene Rolle')
    .addUserOption(option => option.setName('target').setDescription('Der Benutzer, dem die Rolle gegeben werden soll').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('Die Rolle, die dem Benutzer gegeben werden soll').setRequired(true)),

  async execute(interaction) {
    const adminUserId = '1058899519351304272';
    const author = interaction.user;
    const targetUser = interaction.options.getUser('target');
    const roleToAssign = interaction.options.getRole('role');

    if (author.id !== adminUserId) {
      const now = new Date();
      now.setUTCHours(now.getUTCHours() + 1); // Convert to UTC+1
      
      const dd = String(now.getUTCDate()).padStart(2, '0');
      const mm = String(now.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-based
      const yy = String(now.getUTCFullYear()).slice(-2);
      const hh = String(now.getUTCHours()).padStart(2, '0');
      const min = String(now.getUTCMinutes()).padStart(2, '0');
      
      const formattedDate = `${dd}/${mm}/${yy} - ${hh}:${min}`;
      const errorEmbedforadmin = new MessageEmbed()
        .setColor('#ED4245')
        .setTitle('FEHLER')
        .addFields([
          { "name": "`User:`", "value": "```yaml\n" + `${author.tag}` + "\n```", "inline": true },
          { "name": "`ID:`", "value": "```yaml\n" + `${author.id}` + "```", "inline": true },
          { "name": "`Grund:`", "value": "```yaml\n" + `Keine Berechtigungen` + "```", "inline": true },
          { "name": "`Datum:`", "value": "```yaml\n" + `${formattedDate} Uhr` + "```", "inline": true },
        ]);

      return interaction.reply({ embeds: [errorEmbedforadmin], ephemeral: true });
    }


    const targetMember = interaction.guild.members.cache.get(targetUser.id);

    if (!targetMember) {
      return interaction.reply('Ungültiges GuildMember-Objekt.');
    }

    // Überprüfen, ob die Rolle über dem Bot liegt
    if (targetMember.roles.cache.has(roleToAssign.id)) {
      const allRoles = targetMember.roles.cache
        .filter(role => role.name !== '@everyone')
        .map(role => `${role.toString()}`);
        const now = new Date();
        now.setUTCHours(now.getUTCHours() + 1); // Convert to UTC+1
      
        const dd = String(now.getUTCDate()).padStart(2, '0');
        const mm = String(now.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-based
        const yy = String(now.getUTCFullYear()).slice(-2);
        const hh = String(now.getUTCHours()).padStart(2, '0');
        const min = String(now.getUTCMinutes()).padStart(2, '0');
        
        const formattedDate = `${dd}/${mm}/${yy} - ${hh}:${min}`;
        const errorEmbed = new MessageEmbed()
        .setColor('#ED4245')
        .setTitle('FEHLER')
        .addFields([
          { "name": "`User:`", "value": "```yaml\n" + `${targetUser.tag}` + "\n```", "inline": true },
          { "name": "`ID:`", "value": "```yaml\n" + `${targetUser.id}` + "```", "inline": true },
          { "name": "`Grund:`", "value": "```yaml\n" + `hat bereits die Rolle` + "```", "inline": true },
          { "name": "`Admin:`", "value": "```yaml\n" + `${author.tag}` + "```", "inline": true },
          { "name": "`Datum:`", "value": "```yaml\n" + `${formattedDate} Uhr` + "```", "inline": true }
        ]);
      
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    // Erfolgs-Embed mit allen Rollen des Benutzers (ohne @everyone)
    const allRoles = targetMember.roles.cache
        .filter(role => role.name !== '@everyone')
        .map(role => `${role.toString()}`);
        const now = new Date();
        now.setUTCHours(now.getUTCHours() + 1); // Convert to UTC+1
      
        const dd = String(now.getUTCDate()).padStart(2, '0');
        const mm = String(now.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-based
        const yy = String(now.getUTCFullYear()).slice(-2);
        const hh = String(now.getUTCHours()).padStart(2, '0');
        const min = String(now.getUTCMinutes()).padStart(2, '0');
        
        const formattedDate = `${dd}/${mm}/${yy} - ${hh}:${min}`;
        const successEmbed = new MessageEmbed()
        .setColor('#57F287')
        .setTitle('ERFOLGREICH')
        .addFields([
          { "name": "`User:`", "value": "```yaml\n" + `${targetUser.tag}` + "\n```", "inline": true },
          { "name": "`ID:`", "value": "```yaml\n" + `${targetUser.id}` + "```", "inline": true },
          { "name": "`Grund:`", "value": "```yaml\n" + `hat die Rolle erhalten` + "```", "inline": true },
          { "name": "`Admin:`", "value": "```yaml\n" + `${author.tag}` + "```", "inline": true },
          { "name": "`Datum:`", "value": "```yaml\n" + `${formattedDate} Uhr` + "```", "inline": true }
        ]);
      
    await targetMember.roles.add(roleToAssign);
    await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    
  }
};
