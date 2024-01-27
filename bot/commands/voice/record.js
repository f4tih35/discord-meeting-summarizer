const {SlashCommandBuilder} = require('discord.js');
const {joinVoiceChannel} = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');
const prism = require('prism-media');
const SQLite = require('better-sqlite3');
const sql = new SQLite('./db.sqlite');

const saveEntityToDatabase = (recordingPath) => {
    const insert = sql.prepare("INSERT INTO entities (sound_file_path) VALUES (?);");
    insert.run(recordingPath);
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('record')
        .setDescription('Joins your voice channel and starts recording.'),
    async execute(interaction) {
        if (!interaction.member.voice.channelId) {
            await interaction.reply('You need to be in a voice channel to use this command!');
            return;
        }

        let audioIdx = 0;
        const now = new Date();
        const formattedDateTime = now.toISOString().replace(/:/g, '-').replace('T', '_').split('.')[0];
        const recordingsPath = path.join(process.cwd(), `/recordings/${formattedDateTime}`);

        if (!fs.existsSync(recordingsPath)) {
            fs.mkdirSync(recordingsPath, {recursive: true});
        }

        const voiceChannel = interaction.member.voice.channel;
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false,
        });

        interaction.client.voiceConnections.set(interaction.guildId, connection);

        voiceChannel.members.forEach((member, memberId) => {
            const audioStream = connection.receiver.subscribe(memberId, {
                end: {
                    behavior: 'afterSilence',
                    duration: 100,
                },
            });

            let lastSpokeTime = Date.now();
            let currentStream = null;
            let currentOpusDecoder = null;

            const startNewRecording = () => {
                if (currentStream) {
                    currentOpusDecoder.end();
                    currentStream.end();
                }

                audioIdx++;
                const outputPath = path.join(recordingsPath, `${audioIdx}-${memberId}.pcm`);
                currentStream = fs.createWriteStream(outputPath);
                currentOpusDecoder = new prism.opus.Decoder({frameSize: 960, channels: 2, rate: 48000});
                currentOpusDecoder.pipe(currentStream, {end: true});
            };

            audioStream.on('data', (data) => {
                const now = Date.now();
                if (now - lastSpokeTime > 1000) {
                    startNewRecording();
                }
                lastSpokeTime = now;

                if (currentOpusDecoder) {
                    currentOpusDecoder.write(data);
                }
            });

            audioStream.on('end', () => {
                if (currentOpusDecoder) {
                    currentOpusDecoder.end();
                }
                if (currentStream) {
                    currentStream.end();
                    saveEntityToDatabase(recordingsPath);
                }
            });

            audioStream.on('error', (error) => {
                console.error('Audio stream error:', error);
            });

            startNewRecording();
        });

        await interaction.reply('Recording started!');
    },
};
