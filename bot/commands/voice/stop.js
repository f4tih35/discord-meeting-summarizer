const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the recording and leaves the voice channel.'),
    async execute(interaction) {
        const connection = interaction.client.voiceConnections.get(interaction.guildId);

        if (connection) {
            connection.disconnect();
            interaction.client.voiceConnections.delete(interaction.guildId);
            await interaction.reply('Stopped recording and left the voice channel.');
        } else {
            await interaction.reply('Not currently recording in any channel.');
        }
    },
};
