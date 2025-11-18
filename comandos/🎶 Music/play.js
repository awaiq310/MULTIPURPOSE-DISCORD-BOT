module.exports = {
    name: "play",
    aliases: ["play"],
    desc: "Used to play a song",
    run: async (client, message, args, prefix) => {
        if (!client.distube) {
            return message.reply(`❌ **Music system is currently disabled!**\nTo enable music, install the required dependencies:\n\`npm install @discordjs/opus @distube/soundcloud @distube/spotify distube libsodium-wrappers\``);
        }
        //previous checks
        if(!args.length) return message.reply(`❌ **You have to specify the name of a song!**`);
        if(!message.member.voice?.channel) return message.reply(`❌ **You have to be in a voice channel to execute this command!**`);
        if(message.guild.members.me.voice?.channel && message.member.voice?.channel.id != message.guild.members.me.voice?.channel.id) return message.reply(`❌ **You have to be in the same voice channel __AS ME__ to execute this command!**`);
        client.distube.play(message.member.voice?.channel, args.join(" "), {
            member: message.member,
            textChannel: message.channel,
            message
        });
        message.reply(`🔎 **Searching \`${args.join(" ")}\`...**`);
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
