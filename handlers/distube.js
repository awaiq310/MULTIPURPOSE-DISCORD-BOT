module.exports = (client, Discord) => {
    try {
        const { DisTube } = require('distube');
        
        client.distube = new DisTube(client, {
            leaveOnStop: false,
            leaveOnFinish: false,
            leaveOnEmpty: true,
            emptyCooldown: 30
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
        client.distube = null;
    }
};

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/