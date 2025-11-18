module.exports = {
    name: "skip",
    aliases: ["next"],
    desc: "Used to skip a song",
    run: async (client, message, args, prefix) => {
        if (!client.distube) {
            return message.reply(`❌ **Music system is currently disabled!**\nTo enable music, install the required dependencies:\n\`npm install @discordjs/opus @distube/soundcloud @distube/spotify distube libsodium-wrappers\``);
        }
        //previous checks
        const queue = client.distube.getQueue(message);
        if(!queue) return message.reply(`❌ **No song is playing!**`);
        if(!message.member.voice?.channel) return message.reply(`❌ **You have to be in a voice channel to execute this command!**`);
        if(message.guild.members.me.voice?.channel && message.member.voice?.channel.id != message.guild.members.me.voice?.channel.id) return message.reply(`❌ **You have to be in the same voice channel __AS ME__ to execute this command!**`);
        client.distube.skip(message);
        message.reply(`⏭ **Skipping to the next song!**`)
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
