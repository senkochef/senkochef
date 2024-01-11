const { MessageActionRow, MessageButton } = require('discord.js');

let currentClothingNumber = 1;
let currentClothingPacksNumber = 1;
let currentFraktionPacksNumber = 1;
const activeTickets = new Map();
const userActions = new Set();

module.exports = {
  data: {
    name: 'ticketcreate',
    description: 'Erstellt ein Ticket',
  },
  async execute(interaction) {
    try {
      // Überprüfe, ob der Benutzer, der den Befehl ausführt, du bist
      if (interaction.user.id !== '1058899519351304272') {
        return interaction.reply({ content: 'Du hast keine Berechtigung für diesen Befehl.', ephemeral: true });
      }

      // Überprüfe, ob der Benutzer bereits ein offenes Ticket hat
      if (activeTickets.has(interaction.user.id)) {
        return interaction.reply({ content: 'Du hast bereits ein offenes Ticket. Schließe es, bevor du ein neues erstellst.', ephemeral: true });
      }

      // Überprüfe, ob der Benutzer bereits eine Aktion ausgeführt hat
      if (userActions.has(interaction.user.id)) {
        return interaction.reply({ content: 'Du hast bereits eine Aktion ausgelöst. Bitte warte, bevor du eine weitere Aktion ausführst.', ephemeral: true });
      }

      // Markiere den Benutzer als ausgeführt für diese Aktion
      userActions.add(interaction.user.id);

      // Erstelle ein Embed mit den Buttons
      const embed = {
        color: 0x0099ff,
        title: 'Ticket erstellen',
        description: 'Wähle eine Kategorie aus:',
      };

      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('clothing')
            .setLabel('Clothing')
            .setStyle('PRIMARY'),
          new MessageButton()
            .setCustomId('clothingPacks')
            .setLabel('Clothing Packs')
            .setStyle('PRIMARY'),
          new MessageButton()
            .setCustomId('fraktionPacks')
            .setLabel('Fraktion Packs')
            .setStyle('PRIMARY'),
        );

      // Verzögere die Antwort auf den Befehl und sende dann die Auswahlmöglichkeiten
      await interaction.deferReply({ ephemeral: false });
      await interaction.editReply({ content: 'Wähle eine Kategorie aus:', embeds: [embed], components: [row] });

      const filter = i => i.customId === 'clothing' || i.customId === 'clothingPacks' || i.customId === 'fraktionPacks';

      // Warte auf die Button-Auswahl des Benutzers
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 300000 });

      collector.on('collect', async i => {
        // Der Benutzer hat einen Button ausgewählt
        await i.deferUpdate();

        // Überprüfe, ob der Benutzer bereits ein offenes Ticket hat
        if (activeTickets.has(interaction.user.id)) {
          return i.followUp({ content: 'Du hast bereits ein offenes Ticket. Schließe es, bevor du ein neues erstellst.', ephemeral: true });
        }

        // Markiere den Benutzer als aktiv für ein Ticket
        let ticketNumber;
        let category;
        let categoryName;
        let emoji;

        if (i.customId === 'clothing') {
          ticketNumber = currentClothingNumber++;
          category = 'Clothing';
          categoryName = 'Clothing';
          emoji = '⚪️';
        } else if (i.customId === 'clothingPacks') {
          ticketNumber = currentClothingPacksNumber++;
          category = 'Clothing-Pack';
          categoryName = 'Clothing Packs';
          emoji = '🔵';
        } else if (i.customId === 'fraktionPacks') {
          ticketNumber = currentFraktionPacksNumber++;
          category = 'Fraktion-Pack';
          categoryName = 'Fraktion Packs';
          emoji = '🟣';
        }

        activeTickets.set(interaction.user.id, {
          ticketNumber,
          category,
        });

        // Entferne den Benutzer aus der Liste der ausgeführten Aktionen
        userActions.delete(interaction.user.id);

        // Erstelle einen Kanal mit entsprechendem Namen und Emoji
        const channelName = `${emoji}・${category}・${ticketNumber}`;

        const createdChannel = await interaction.guild.channels.create(channelName, {
          type: 'text',
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: ['VIEW_CHANNEL'],
            },
            {
              id: '1194686746747748504', // ID der Rolle für Clothing
              allow: ['VIEW_CHANNEL'],
            },
            // Füge weitere Rollen hinzu, je nach Bedarf
          ],
        });

        // Sende ein Willkommens-Embed mit Schließen-Button
        const welcomeRowWithButton = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId('closeTicket')
              .setLabel('Schließen')
              .setStyle('DANGER'),
          );

        await createdChannel.send({ content: `Willkommen im ${categoryName} Ticket, ${interaction.user}!`, components: [welcomeRowWithButton] });

        // Wenn "Schließen"-Button gedrückt wird, lösche den Kanal
        const closeCollector = createdChannel.createMessageComponentCollector({ filter: c => c.customId === 'closeTicket', time: 300000 });
        closeCollector.on('collect', async c => {
          await c.deferUpdate();
          await createdChannel.delete();
          activeTickets.delete(interaction.user.id);
          closeCollector.stop();
        });
      });

      collector.on('end', collected => {
        // Entferne den Benutzer aus der Liste der ausgeführten Aktionen, wenn der Collector endet
        userActions.delete(interaction.user.id);

        if (collected.size === 0) {
          // Timeout, keine Auswahl getroffen
          interaction.followUp({ content: 'Zeit abgelaufen. Bitte versuche es erneut.', ephemeral: true });
        }
      });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: 'Es gab einen Fehler beim Ausführen dieses Befehls.', ephemeral: true });
    }
  },
};
