const {inspect} = require('util');
const Discord = require('discord.js')
module.exports = {
    name: "eval",
    aliases: ["evaluate", "execute"],
    desc: "Used to execute Discord.js code",
    owner: true,
    run: async (client, message, args, prefix) => {
        if(!args.length) return message.reply(`❌ **You have to specify code to evaluate!**`);

        try {
            const evaluated = await eval(args.join(" "));
            const truncated = truncate(inspect(evaluated), 2045);
            message.channel.send({
                embeds: [new Discord.EmbedBuilder()
                .setTitle(`Evaluation`)
                .setDescription(`\`\`\`js\n${truncated}\`\`\``)
                .setColor(client.color)
                .setTimestamp()
            ]
            })
        } catch (e){
            message.channel.send({
                embeds: [new Discord.EmbedBuilder()
                .setTitle(`Evaluation`)
                .setDescription(`\`\`\`js\n${e.toString().substring(0, 2048)}\`\`\``)
                .setColor("FF0000")
                .setTimestamp()
            ]
            })
        }
    }
}

function truncate(text, n){
    if(text.length > n){
        return text.substring(0, n) + "..."
    } else {
        return text;
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/