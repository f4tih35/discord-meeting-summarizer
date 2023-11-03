const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioResource, StreamType, createAudioPlayer } = require('@discordjs/voice');
const fs = require('fs');
const prism = require('prism-media');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('record')
        .setDescription('Joins your voice channel and starts recording.'),
    async execute(interaction) {
        if (!interaction.member.voice.channelId) {
            return interaction.reply('You need to be in a voice channel to use this command!');
        }

        const voiceChannel = interaction.member.voice.channel;
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        const audioPlayer = createAudioPlayer();
        connection.subscribe(audioPlayer);

        const output = fs.createWriteStream(`./record-${Date.now()}.pcm`);
        const audioResource = createAudioResource(new prism.opus.Decoder({
            rate: 48000,
            channels: 2,
            frameSize: 960,
        }));

        audioPlayer.play(audioResource);

        connection.receiver.speaking.on('start', (userId) => {
            console.log(`User ${userId} started speaking`);
            const opusStream = connection.receiver.subscribe(userId, {
                end: {
                    behavior: StreamType.Raw,
                },
            });
            const opusDecoder = new prism.opus.Decoder({
                rate: 48000,
                channels: 2,
                frameSize: 960,
            });
            opusStream.pipe(opusDecoder).pipe(output);
        });

        connection.receiver.speaking.on('end', (userId) => {
            console.log(`User ${userId} stopped speaking`);
        });

        await interaction.reply('Started recording!');

        setTimeout(() => {
            output.close();
            console.log('Recording stopped after 10 seconds.');
            connection.destroy();
            console.log('Left the voice channel.');
        }, 10000);
    },
};
