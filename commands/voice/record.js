const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');
const prism = require('prism-media');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('record')
        .setDescription('Joins your voice channel and starts processing your voice.'),
    async execute(interaction) {
        if (!interaction.member.voice.channelId) {
            await interaction.reply('You need to be in a voice channel to use this command!');
            return;
        }

        let audioIdx = 0;
        const userAudioMap = new Map();

        const voiceChannel = interaction.member.voice.channel;
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false,
        });

        voiceChannel.members.forEach((member, memberId) => {
            const audioStream = connection.receiver.subscribe(memberId, {
                end: {
                    behavior: 'afterSilence',
                    duration: 100,
                },
            });

            audioStream.on('data', (chunk) => {
                let userAudio = userAudioMap.get(memberId);
                if (!userAudio) {
                    audioIdx += 1;
                    const outputPath = path.join(process.cwd(), `/recordings/${audioIdx}-${memberId}.pcm`);
                    userAudio = {
                        stream: fs.createWriteStream(outputPath),
                        timeout: null
                    };
                    const opusDecoder = new prism.opus.Decoder({
                        frameSize: 960,
                        channels: 2,
                        rate: 48000,
                    });
                    audioStream.pipe(opusDecoder).pipe(userAudio.stream, { end: false });
                    userAudioMap.set(memberId, userAudio);
                }

                clearTimeout(userAudio.timeout);
                userAudio.timeout = setTimeout(() => {
                    userAudio.stream.end();
                    userAudioMap.delete(memberId);
                }, 2000);
            });
        });

        await interaction.reply('Recording started!');

        setTimeout(() => {
            userAudioMap.forEach((userAudio) => {
                clearTimeout(userAudio.timeout);
                if (userAudio.stream) {
                    userAudio.stream.end();
                }
            });
            connection.destroy();
            interaction.followUp('Recording is complete, and the bot has disconnected.');
        }, 30000);
    },
};
