const serverSchema = require(`${process.cwd()}/modelos/servidor.js`)
const keySchema = require(`${process.cwd()}/modelos/clave.js`)
module.exports = {
    name: "claim",
    aliases: ["reclamar", "claim-key"], 
    desc: "Used to claim a Premium Key",
    permisos: ["Administrator"],
    run: async (client, message, args, prefix) => {
        const clave = await keySchema.findOne({clave: args[0]});
        if(clave) {
            if(clave.activado) {
                return message.reply("❌ **The key you mentioned has already been used!**");
            } else {
                //cambiamos el estado de la clave a usada / activado
                clave.activado = true;
                clave.save();

                //activamos el premium en el servidor
                await serverSchema.findOneAndUpdate({guildID: message.guild.id}, {
                    premium: Math.round(Date.now() + Number(clave.duracion))
                });
                return message.reply(`✅ **Premium features have been activated on this server!**\nExpirará en <t:${Math.round((Date.now() + Number(clave.duracion)) / 1000)}:R>`)
            }
        } else {
            return message.reply("❌ **The key you specified was not found!**")
        }
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
