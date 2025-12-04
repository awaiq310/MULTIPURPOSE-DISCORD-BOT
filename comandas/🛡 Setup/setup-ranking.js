const Discord = require('discord.js');
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);
module.exports = {
    name: "setup-rank",
    aliases: ["setup-ranking", "setup-ranks", "setup-niveles", "setup-nivel", "setup-level", "setup-levels"],
    desc: "Used to create a level system",
    permisos: ["Administrator"],
    run: async (client, message, args, prefix) => {
        const canalNotificaciones = message.guild.channels.cache.get(args[0]) || message.mentions.channels.filter(c => c.guild.id == message.guild.id).first()
        if(!canalNotificaciones) return message.reply("❌ **You have not specified a notification channel for level ups!**");

        const mensaje = args.slice(1).join(" ").substring(0, 2048);
        if(!mensaje) return message.reply("❌ **You have not specified a message when a user levels up!**");

        await setupSchema.findOneAndUpdate({guildID: message.guild.id}, {
            niveles: {
                canal: canalNotificaciones.id,
                mensaje
            }
        })

        return message.reply({embeds: [
            new Discord.EmbedBuilder().setTitle(`✅ Level System activated!`)
            .setDescription(`*I will send notifications when a user levels up in ${canalNotificaciones}*`)
            .setColor('Green')
        ]})
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
