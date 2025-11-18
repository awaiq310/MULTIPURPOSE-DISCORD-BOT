const {ensure_all} = require(`${process.cwd()}/utils/funciones.js`);
const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
const Discord = require('discord.js');
module.exports = {
    name: "balance",
    aliases: ["money", "wallet", "bal", "bank"],
    desc: "Used to view a user's wallet",
    run: async (client, message, args, prefix) => {
        const user = message.guild.members.cache.get(args[0]) || message.mentions.members.filter(m => m.guild.id == message.guild.id).first() || message.member;
        if(user.bot) return message.reply("❌ **Bots cannot have money!**");
        
        try {
            await ensure_all(null, user.id);
            let data = await ecoSchema.findOne({userID: user.id});
            if (!data) {
                return message.reply("❌ **Database unavailable! Economy system is disabled.**");
            }
            message.reply({
                embeds: [new Discord.EmbedBuilder()
                .setAuthor({name: `${user.user.tag}'s Wallet`, iconURL: user.displayAvatarURL({dynamic: true})})
                .setDescription(`💵 **Wallet:** \`${data.dinero} coins\`\n🏦 **Bank:** \`${data.banco} coins\``)
                .setColor(client.color)
                ]
            });
        } catch (error) {
            return message.reply("❌ **Database unavailable! Economy system is disabled.**");
        }
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
