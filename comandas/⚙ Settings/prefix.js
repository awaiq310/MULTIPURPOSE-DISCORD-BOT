const schema = require(`${process.cwd()}/modelos/servidor.js`)
module.exports = {
    name: "prefix",
    aliases: ["changeprefix", "setprefix"],
    desc: "Used to change the Bot's Prefix on the Server",
    permisos: ["Administrator"],
    run: async (client, message, args, prefix, idioma) => {
        if(!args[0]) return message.reply(client.la[idioma]["comandos"]["ajustes"]["prefix"]["variable1"])
        await schema.findOneAndUpdate({guildID: message.guild.id}, {
            prefijo: args[0]
        })
        return message.reply(eval(client.la[idioma]["comandos"]["ajustes"]["prefix"]["variable2"]))
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
