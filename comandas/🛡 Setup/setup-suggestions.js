const Discord = require('discord.js');
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);

module.exports = {
    name: "setup-suggestion",
    aliases: ["suggestion-setup", "setup-sugerencias", "setup-sugerencia", "setupsugerencias"],
    desc: "Used to create a Suggestions system",
    permisos: ["Administrator"],
    permisos_bot: ["ManageRoles", "ManageChannels"],
    run: async (client, message, args, prefix) => {
        if(!args.length) return message.reply("❌ **You have to specify the suggestions channel!**")
        const channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.filter(c => c.guild.id == message.guild.id).first()
        if(!channel || channel.type !== 0) return message.reply("❌ **The suggestions channel you mentioned does not exist!**");
        await setupSchema.findOneAndUpdate({guildID: message.guild.id}, {
            sugerencias: channel.id
        })
        return message.reply({
            embeds: [new Discord.EmbedBuilder()
            .setTitle(`✅ Set suggestions channel to \`${channel.name}\``)
            .setDescription(`*Every time someone sends a message in ${channel}, I will convert it to a suggestion!*`)
            .setColor(client.color)
            ]
        })
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
