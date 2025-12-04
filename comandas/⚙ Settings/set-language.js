const schema = require(`${process.cwd()}/modelos/servidor.js`);
const fs = require('fs');
module.exports = {
    name: "set-language",
    aliases: ["set-lang", "setlanguage", "change-lang", "changelanguage", "changelang", "lang", "language"],
    desc: "Used to change the Bot's Language on the Server",
    permisos: ["Administrator"],
    run: async (client, message, args, prefix, idioma) => {
        const data = await schema.findOne({guildID: message.guild.id});
        let languages = fs.readdirSync(`./idiomas`).filter(file => file.endsWith(".json")).map(file => file.replace(/.json/, ""));
        if(!args[0]) return message.reply(eval(client.la[idioma]["comandos"]["ajustes"]["set-language"]["variable1"]));
        if(!languages.includes(args[0])) return message.reply(eval(client.la[idioma]["comandos"]["ajustes"]["set-language"]["variable2"]));
        data.idioma = args[0];
        data.save();
        return message.reply(eval(client.la[idioma]["comandos"]["ajustes"]["set-language"]["variable3"]))
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
