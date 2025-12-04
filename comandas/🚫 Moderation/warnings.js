const {paginacion} = require(`${process.cwd()}/utils/funciones.js`);
const warnSchema = require(`${process.cwd()}/modelos/warns.js`);
const {asegurar_all} = require(`${process.cwd()}/utils/funciones.js`)
module.exports = {
    name: "warnings",
    aliases: ["avisos", "user-warns", "warnings-user", "warns"],
    desc: "Used to mostrar los warnings de un Usuario",
    run: async (client, message, args, prefix) => {
        const user = message.guild.members.cache.get(args[0]) || message.mentions.members.filter(m => m.guild.id == message.guild.id).first() || message.member;
        await asegurar_all(message.guild.id, user.id)
        let data = await warnSchema.findOne({guildID: message.guild.id, userID: user.id});
        if(data.warnings.length == 0) return message.reply(`✅ **\`${user.user.tag}\` no tiene ningún warning en el servidor!**`);
        const texto = data.warnings.map((warn, index) => `================================\n**ID DE WARN:** \`${index}\`\n**FECHA:** <t:${Math.round(warn.fecha / 1000)}>\n**AUTOR:** <@${warn.autor}> *\`${message.guild.members.cache.get(warn.autor).user.tag}\`*\n**RAZÓN:** \`${warn.razon}\`\n`)
        paginacion(client, message, texto, `🛠 \`[${data.warnings.length}]\` WARNINGS DE ${user.user.tag}`, 1)
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
