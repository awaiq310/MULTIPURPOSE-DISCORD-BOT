const Discord = require('discord.js');
const { asegurar_all } = require(`${process.cwd()}/utils/funciones.js`)
const warnSchema = require(`${process.cwd()}/modelos/warns.js`)
module.exports = {
    name: "unwarn",
    aliases: ["deswarnear", "remove-warn", "quitar-aviso"],
    desc: "Used to quitar un aviso a un user del Servidor",
    permisos: ["Administrator", "BanMembers"],
    permisos_bot: ["Administrator", "BanMembers"],
    run: async (client, message, args, prefix) => {
        //definimos la persona a avisar
        let user = message.guild.members.cache.get(args[0]) || message.mentions.members.filter(m => m.guild.id == message.guild.id).first();
        if (!user) return message.reply(`❌ **The user you specified was not found!**`);
        await asegurar_all(message.guild.id, user.id);
        //definimos razón, y si no hay, la razón será "No se ha specified ninguna razón!"
        let id_warn = args[1];
        let data = await warnSchema.findOne({ guildID: message.guild.id, userID: user.id });
        if (data.warnings.length === 0) return message.reply(`❌ **The user que has specified no tiene ningún warning!**`);
        if (!id_warn) return message.reply(`❌ **No se ha found el warn que has specified!**`);
        if (isNaN(id_warn) || id_warn < 0) message.reply(`❌ **La ID del warn que has specified no es válida!**`);
        if(data.warnings[id_warn] == undefined) return message.reply(`❌ **No se ha found el warn que has specified!**`);

            //comprobamos que el user a avisar no es el dueño del servidor
            if (user.id == message.guild.ownerId) return message.reply(`❌ **You cannot avisar al DUEÑO del Servidor!**`);

            //compsteal que el BOT está por encima del user a avisar
            if (message.guild.members.me.roles.highest.position > user.roles.highest.position) {
                //compsteal que la posición del rol del user que ejecuta el comando sea mayor a la persona que vaya a avisar
                if (message.member.roles.highest.position > user.roles.highest.position) {

                    message.reply({
                        embeds: [new Discord.EmbedBuilder()
                            .setTitle(`✅ Warn removido`)
                            .setDescription(`**Se ha removido el warn con ID \`${id_warn}\` de \`${user.user.tag}\` exitosamente!**`)
                            .setColor(client.color)
                            .setTimestamp()
                        ]
                    })
                    data.warnings.splice(id_warn, 1);
                    data.save();
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
