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

        const audioStreams = new Map();

        for (const [memberId, member] of voiceChannel.members) {
            const audioStream = connection.receiver.subscribe(memberId, {
                end: {
                    behavior: 'afterSilence',
                    duration: 100,
                },
            });

            const outputPath = path.join(process.cwd(), `/recordings/user-${memberId}.pcm`);
            const writeStream = fs.createWriteStream(outputPath);

            const opusDecoder = new prism.opus.Decoder({
                frameSize: 960,
                channels: 2,
                rate: 48000,
            });

            audioStream.pipe(opusDecoder).pipe(writeStream);
            audioStreams.set(memberId, {
                audioStream,
                writeStream,
            });
        }

        await interaction.reply('Recording started!');

        setTimeout(() => {
            audioStreams.forEach((streamObj) => {
                streamObj.audioStream.destroy();
                streamObj.writeStream.end();
            });
            connection.destroy();
            interaction.followUp('Recording is complete, and the bot has disconnected.');
        }, 5000);
    },
};
