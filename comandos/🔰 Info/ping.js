module.exports = {
    name: "ping",
    aliases: ["latency", "ms"],
    desc: "Used to view the Bot's latency",
    run: async (client, message, args, prefix) => {
        message.reply(`Pong! The Bot's ping is \`${client.ws.ping}ms\``)
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
