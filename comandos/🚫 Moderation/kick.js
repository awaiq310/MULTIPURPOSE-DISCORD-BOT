const Discord = require('discord.js')
module.exports = {
    name: "kick",
    aliases: ["kickuser"],
    desc: "Used to kick a user from the Server",
    permisos: ["Administrator", "KickMembers"],
    permisos_bot: ["Administrator", "KickMembers"],
    run: async (client, message, args, prefix) => {
        //define the person to kick
        let user = message.guild.members.cache.get(args[0]) || message.mentions.members.filter(m => m.guild.id == message.guild.id).first();
        if (!user) return message.reply(`❌ **The user you specified was not found!**`);

        //define reason, and if there isn't one, the reason will be "No reason specified!"
        let reason = args.slice(1).join(" ");
        if (!reason) reason = "No reason specified!"

        //check that the user to kick is not the server owner
        if (user.id == message.guild.ownerId) return message.reply(`❌ **You cannot kick the SERVER OWNER!**`);

        //check that the BOT is above the user to kick
        if (message.guild.members.me.roles.highest.position > user.roles.highest.position) {
            //check that the role position of the user executing the command is higher than the person to be kicked
            if (message.member.roles.highest.position > user.roles.highest.position) {
                //send the user a private message that they have been kicked!
                user.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle(`You have been kicked from __${message.guild.name}__`)
                            .setDescription(`**Reason:** \n\`\`\`yml\n${reason}\`\`\``)
                            .setColor(client.color)
                            .setTimestamp()
                    ]
                }).catch(() => { message.reply(`Could not send DM to the user!`) });
                //send in the channel that the user has been successfully kicked

                message.reply({
                    embeds: [new Discord.EmbedBuilder()
                        .setTitle(`✅ User kicked`)
                        .setDescription(`**Successfully kicked \`${user.user.tag}\` *(\`${user.id}\`)* from the server!**`)
                        .addFields([{ name: `Reason`, value: `\n\`\`\`yml\n${reason}\`\`\`` }])
                        .setColor(client.color)
                        .setTimestamp()
                    ]
                })

                user.kick([reason]).catch(() => {
                    return message.reply({
                        embeds:
                            [new Discord.EmbedBuilder()
                                .setTitle(`❌ I couldn't kick the user!`)
                                .setColor("FF0000")
                            ]
                    })
                })
            } else {
                return message.reply(`❌ **Your Role is __below__ the user you want to kick!**`)
            }
        } else {
            return message.reply(`❌ **My Role is __below__ the user you want to kick!**`)
        }


    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
