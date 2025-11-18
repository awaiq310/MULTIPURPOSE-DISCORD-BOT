const Levels = require('discord-xp');
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);
module.exports = {
    name: "nivel",
    aliases: ["level", "rank"],
    desc: "Used to ver tu nivel",
    run: async (client, message, args, prefix) => {
        let setupData = await setupSchema.findOne({guildID: message.guild.id});
        if(!setupData.niveles || !setupData.niveles.mensaje || !message.guild.channels.cache.get(setupData.niveles.canal)) return message.reply("❌ **No está activado el sistema de niveles en este servidor!**");
        const user = await Levels.fetch(message.author.id, message.guild.id);
        const xpSiguienteNivel = await Levels.xpFor(user.level+1);

        message.reply(`**Eres nivel \`${user.level}\`**\nNecesitas \`${xpSiguienteNivel - user.xp}xp\` más para llegar al siguiente nivel!`)
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
