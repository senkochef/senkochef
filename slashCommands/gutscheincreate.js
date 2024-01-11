// gutscheincreate.js
const { v4: uuidv4 } = require('uuid');
const { MessageEmbed } = require('discord.js');

function generateCodes(anzahl) {
  const codes = [];
  for (let i = 0; i < anzahl; i++) {
    codes.push(uuidv4());
  }
  return codes;
}

module.exports = {
  data: {
    name: 'gcode',
    description: 'Gutschein-Codes erstellen',
    options: [
      {
        type: 4, // INTEGER
        name: 'anzahl',
        description: 'Anzahl der zu erstellenden Codes',
        required: true,
      },
      {
        type: 3, // STRING
        name: 'beschreibung',
        description: 'Beschreibung für die Gutscheine',
        required: true,
      },
      {
        type: 3, // STRING
        name: 'gueltigkeit',
        description: 'Gültigkeitsdauer der Gutscheine',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const adminUserId = '10588995193513042722';
    const author = interaction.user;
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
      const anzahl = interaction.options.getInteger('anzahl');
      const beschreibung = interaction.options.getString('beschreibung');
      const gueltigkeit = interaction.options.getString('gueltigkeit');
      const codes = generateCodes(anzahl);
            const now = new Date();
      now.setUTCHours(now.getUTCHours() + 1); // Convert to UTC+1
    
      const dd = String(now.getUTCDate()).padStart(2, '0');
      const mm = String(now.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-based
      const yy = String(now.getUTCFullYear()).slice(-2);
      const hh = String(now.getUTCHours()).padStart(2, '0');
      const min = String(now.getUTCMinutes()).padStart(2, '0');
      
      const formattedDate = `${dd}/${mm}/${yy} - ${hh}:${min}`;
      const zahl = codes.length;
      const codeembed = new MessageEmbed()
      
      .setColor('#57F287')
      .setTitle('ERFOLGREICH')
      .addFields([
        { "name": "`Gutschein-Codes:`", "value": "```yaml\n" + `${codes.map((code, i) => `${i + 1}. ${code}`).join("\n")}` + "\n```", "inline": true },
        { "name": "`Beschreibung`", "value": "```yaml\n" + `${beschreibung}` + "```", "inline": true },
        { "name": "`Gültigkeit:`", "value": "```yaml\n" + `${gueltigkeit}` + "```", "inline": true },
        { "name": "`Admin:`", "value": "```yaml\n" + `${author.tag}` + "```", "inline": true },
        { "name": "`Datum:`", "value": "```yaml\n" + `${formattedDate} Uhr` + "```", "inline": true }
      ]);
      await interaction.reply({ embeds: [codeembed], ephemeral: true });
  },
};
