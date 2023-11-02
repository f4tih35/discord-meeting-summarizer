const fs = require('node:fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');
const prism = require('prism-media');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('record')
        .setDescription('Record the voice of a specific user in the current voice channel.'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const channelId = interaction.member.voice.channelId;
        if (!channelId) {
            await interaction.reply('You must be in a voice channel to use this command!');
            return;
        }

        const channel = await interaction.client.channels.fetch(channelId);
        const connection = joinVoiceChannel({
            channelId,
            guildId: interaction.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false,
        });

        const writeStream = fs.createWriteStream('./recordings/out.pcm');

        const listenStream = connection.receiver.subscribe(userId);

        const opusDecoder = new prism.opus.Decoder({
            frameSize: 640,
            channels: 1,
            rate: 16000,
        });

        listenStream.pipe(opusDecoder).pipe(writeStream);

        setTimeout(() => {
            listenStream.unpipe(opusDecoder);
            opusDecoder.unpipe(writeStream);
            writeStream.end();
            interaction.followUp('Recording has been stopped after 5 seconds.');
        }, 5000);

        await interaction.reply('Recording started. Please speak.');
    },
};
