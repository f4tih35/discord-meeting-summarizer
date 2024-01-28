const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { apiEndpoint } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('process')
        .setDescription('Process the recording.')
        .addIntegerOption(option =>
            option.setName('id')
            .setDescription('The ID to process')
            .setRequired(true)),
    async execute(interaction) {
        const id = interaction.options.getInteger('id');
        await interaction.reply(`Processing for ID: ${id}...`);
        try {
            const response = await axios.get(`${apiEndpoint}/process/${id}`);
            await interaction.editReply(`${JSON.stringify(response.data)}`);
        } catch (error) {
            console.error('Error:', error);
            await interaction.editReply('There was an error trying to process recording!');
        }
    },
};
