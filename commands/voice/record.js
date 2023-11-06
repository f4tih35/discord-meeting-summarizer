const {SlashCommandBuilder} = require('discord.js');
const {joinVoiceChannel} = require('@discordjs/voice');
const fs = require('node:fs');
const path = require('node:path');
const prism = require('prism-media');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('record')
        .setDescription('Joins your voice channel and starts processing your voice.'),
    async execute(interaction) {
        if (!interaction.member.voice.channelId) {
            return interaction.reply('You need to be in a voice channel to use this command!');
        }

        const voiceChannel = interaction.member.voice.channel;

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false,
        });

        const userId = interaction.member.id;
        const writeStream = fs.createWriteStream('out.pcm');
        const listenStream = connection.receiver.subscribe(userId);

        const opusDecoder = new prism.opus.Decoder({
            frameSize: 960,
            channels: 2,
            rate: 48000,
        });

        listenStream.pipe(opusDecoder).pipe(writeStream);
    },
};
