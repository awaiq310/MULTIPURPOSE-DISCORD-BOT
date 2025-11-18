const fs = require('fs');
module.exports = (client) => {
    try {
        console.log(`
╔═════════════════════════════════════════════════════╗
║                                                     ║
║   Welcome to Handler /-/ by awaiq310 /-/            ║
║                                                     ║
╚═════════════════════════════════════════════════════╝`.yellow)
        let commands = 0;
        fs.readdirSync("./comandos/").forEach((folder) => {
            const commandFiles = fs.readdirSync(`./comandos/${folder}`).filter((file) => file.endsWith(".js"));
            for (let file of commandFiles){
                let command = require(`../comandos/${folder}/${file}`);
                if(command.name) {
                    client.commands.set(command.name, command);
                    commands++
                } else {
                    console.log(`COMMAND [/${folder}/${file}]`, `error => command is not configured`.brightRed)
                    continue;
                }
                if(command.aliases && Array.isArray(command.aliases)) command.aliases.forEach((alias) => client.aliases.set(alias, command.name));
            }
        });
        console.log(`${commands} Commands Loaded`.brightGreen);
    } catch(e){
        console.log(e)
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
