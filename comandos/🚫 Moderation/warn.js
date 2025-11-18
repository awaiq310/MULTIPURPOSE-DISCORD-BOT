const Discord = require('discord.js');
const { ensure_all } = require(`${process.cwd()}/utils/funciones.js`)
const warnSchema = require(`${process.cwd()}/modelos/warns.js`)
module.exports = {
    name: "warn",
    aliases: ["warnear", "avisar"],
    desc: "Used to enviar un aviso a un user del Servidor",
    permisos: ["Administrator", "BanMembers"],
    permisos_bot: ["Administrator", "BanMembers"],
    run: async (client, message, args, prefix) => {
        //definimos la persona a avisar
        let user = message.guild.members.cache.get(args[0]) || message.mentions.members.filter(m => m.guild.id == message.guild.id).first();
        if (!user) return message.reply(`❌ **The user you specified was not found!**`);
        try {
            await ensure_all(message.guild.id, user.id);
        } catch (error) {
            return message.reply(`❌ **Database unavailable! Warning system is disabled.**`);
        }
        //definimos razón, y si no hay, la razón será "No se ha specified ninguna razón!"
        let razon = args.slice(1).join(" ");
        if (!razon) razon = "No se ha specified ninguna razón!"

        //comprobamos que el user a avisar no es el dueño del servidor
        if (user.id == message.guild.ownerId) return message.reply(`❌ **You cannot avisar al DUEÑO del Servidor!**`);

        //compsteal que el BOT está por encima del user a avisar
        if (message.guild.members.me.roles.highest.position > user.roles.highest.position) {
            //compsteal que la posición del rol del user que ejecuta el comando sea mayor a la persona que vaya a avisar
            if (message.member.roles.highest.position > user.roles.highest.position) {
                //enviamos al user por privado que ha sido avisado!
                user.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle(`Has sido avisado de __${message.guild.name}__`)
                            .setDescription(`**Razón:** \n\`\`\`yml\n${razon}\`\`\``)
                            .setColor(client.color)
                            .setTimestamp()
                    ]
                }).catch(() => { message.reply(`No se le ha podido enviar el DM al user!`) });
                //enviamos en el canal que el user ha sido avisado exitosamenete

                message.reply({
                    embeds: [new Discord.EmbedBuilder()
                        .setTitle(`✅ Usuario avisado`)
                        .setDescription(`**Se ha avisado exitosamente a \`${user.user.tag}\` *(\`${user.id}\`)* del servidor!**`)
                        .addFields([{ name: `Razón`, value: `\n\`\`\`yml\n${razon}\`\`\`` }])
                        .setColor(client.color)
                        .setTimestamp()
                    ]
                })
                //creamos el objeto del warn
                let objeto_warn = {
                    fecha: Date.now(),
                    autor: message.author.id,
                    razon
                }
                //empujamos el objeto en la base de datos
                await warnSchema.findOneAndUpdate({ guildID: message.guild.id, userID: user.id }, {
                    $push: {
                        warnings: objeto_warn
                    }
                })
            } else {
                return message.reply(`❌ **Tu Rol está por __debajo__ del user que quieres avisar!**`)
            }
        } else {
            return message.reply(`❌ **Mi Rol está por __debajo__ del user que quieres avisar!**`)
        }


    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
