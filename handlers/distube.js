module.exports = (client, Discord) => {
    try {
        const { DisTube } = require('distube');
        
        client.distube = new DisTube(client, {
            ffmpeg: {
                path: require('ffmpeg-static')
            }
        });

        console.log(`MUSIC Module ENABLED`.green);

        // Basic music events
        client.distube.on('playSong', (queue, song) => {
            queue.textChannel.send(`🎵 **Now Playing:** ${song.name}`);
        });

        client.distube.on('error', (channel, error) => {
            console.error('DisTube Error:', error);
            if (channel) channel.send('❌ An error occurred while playing music!');
        });

    } catch (error) {
        console.log(`MUSIC Module DISABLED (error: ${error.message})`.red);
        console.log('Full error:', error);
        client.distube = null;
    }
};

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/