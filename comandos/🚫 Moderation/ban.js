const Discord = require('discord.js')
module.exports = {
    name: "ban",
    aliases: ["banuser"],
    desc: "Used to ban a user from the Server",
    permisos: ["Administrator", "BanMembers"],
    permisos_bot: ["Administrator", "BanMembers"],
    run: async (client, message, args, prefix) => {
        //define the person to ban
        let user = message.guild.members.cache.get(args[0]) || message.mentions.members.filter(m => m.guild.id == message.guild.id).first();
        if (!user) return message.reply(`❌ **The user you specified was not found!**`);

        //define reason, and if there isn't one, the reason will be "No reason specified!"
        let reason = args.slice(1).join(" ");
        if(!reason) reason = "No reason specified!"

        //check that the user to ban is not the server owner
        if(user.id == message.guild.ownerId) return message.reply(`❌ **You cannot ban the SERVER OWNER!**`);

        //check that the BOT is above the user to ban
        if (message.guild.members.me.roles.highest.position > user.roles.highest.position) {
            //check that the role position of the user executing the command is higher than the person to be banned
            if (message.member.roles.highest.position > user.roles.highest.position) {
                //send the user a private message that they have been banned!
                user.send({embeds: [
                    new Discord.EmbedBuilder()
                    .setTitle(`You have been banned from __${message.guild.name}__`)
                    .setDescription(`**Reason:** \n\`\`\`yml\n${reason}\`\`\``)
                    .setColor(client.color)
                    .setTimestamp()
                ]}).catch(() => {message.reply(`Could not send DM to the user!`)});
                //send in the channel that the user has been successfully banned

                message.reply({embeds: [new Discord.EmbedBuilder()
                .setTitle(`✅ User banned`)
                .setDescription(`**Successfully banned \`${user.user.tag}\` *(\`${user.id}\`)* from the server!**`)
                .addFields([{name: `Reason`, value: `\n\`\`\`yml\n${reason}\`\`\``}])
                .setColor(client.color)
                .setTimestamp()
                ]})

                user.ban({reason: reason}).catch(() => {
                    return message.reply({embeds: 
                    [new Discord.EmbedBuilder()
                    .setTitle(`❌ I couldn't ban the user!`)
                    .setColor("FF0000")
                    ]})
                });
            } else {
                return message.reply(`❌ **Your Role is __below__ the user you want to ban!**`)
            }
        } else {
            return message.reply(`❌ **My Role is __below__ the user you want to ban!**`)
        }


    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
