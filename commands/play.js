const ytdl = require('ytdl-core');

module.exports = {
    name: "play",
    desc: "play a song in your channel",
    example: "!play something",
    alias: ["add","song"],
    run: (client, message, args) => {
        (async () => {
            const queue = message.client.queue;
            const serverQueue = client.queue.get(message.guild.id);

            const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
            const permissions = voiceChannel.permissionsFor(message.client.user);
            if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
                return message.channel.send('I need the permissions to join and speak in your voice channel!');
            }

            const songInfo = await ytdl.getInfo(args[0]);
            const song = {
                title: songInfo.title,
                url: songInfo.video_url,
            };

            if (!serverQueue) {
                const queueContruct = {
                    textChannel: message.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true,
                };

                queue.set(message.guild.id, queueContruct);

                queueContruct.songs.push(song);

                try {
                    var connection = await voiceChannel.join();
                    queueContruct.connection = connection;
                    client.playsong(message, queueContruct.songs[0]);
                } catch (err) {
                    console.log(err);
                    queue.delete(message.guild.id);
                    return message.channel.send(err);
                }
            } else {
                serverQueue.songs.push(song);
                return message.channel.send(`${song.title} has been added to the queue!`);
            }
        })();
    }
};