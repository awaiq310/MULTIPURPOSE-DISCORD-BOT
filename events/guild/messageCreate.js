const config = require(`${process.cwd()}/config/config.json`);
const Discord = require('discord.js');
const serverSchema = require(`${process.cwd()}/modelos/servidor.js`)
const { ensure_all } = require(`${process.cwd()}/utils/funciones.js`)

// Set to track processed messages and prevent duplicates
const processedMessages = new Set();

module.exports = async (client, message) => {
    if (!message.guild || !message.channel || message.author.bot) return;
    
    // Prevent processing the same message multiple times
    if (processedMessages.has(message.id)) return;
    processedMessages.add(message.id);
    
    // Clean up old message IDs to prevent memory leak (keep last 1000)
    if (processedMessages.size > 1000) {
        const oldIds = Array.from(processedMessages).slice(0, processedMessages.size - 1000);
        oldIds.forEach(id => processedMessages.delete(id));
    }
    
    console.log(`Message received: ${message.content}`.gray);
    
    let data;
    try {
        if (client.dbAvailable) {
            await ensure_all(message.guild.id, message.author.id, client);
            data = await serverSchema.findOne({guildID: message.guild.id}).maxTimeMS(3000);
        }
    } catch (err) {
        console.log(`Database operation failed:`.yellow, err.message);
    }
    
    // Use default values if database is unavailable or data not found
    if (!data) {
        data = { prefijo: config.prefix, idioma: 'en' };
    }

    // Force config prefix if database prefix is different
    const prefix = config.prefix;
    
    //if the bot is mentioned, return a response message indicating the prefix set on the server
    if(message.content.includes(client.user.id)) return message.reply({
        embeds: [
            new Discord.EmbedBuilder()
            .setTitle(`✅ **To see my commands use \`${prefix}help\`!**`)
            .setFooter({text: `© developed by awaiq310 | 2025`, iconURL: `https://cdn.discordapp.com/avatars/282942681980862474/7ff4f4ae92af5feb0d258a71cdb0b060.png`})
            .setColor(client.color)
        ]
    })
    console.log(`Using prefix: ${prefix}`.gray);
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(" ");
    const cmd = args.shift()?.toLowerCase();
    console.log(`Command received: ${cmd}`.cyan);
    const command = client.commands.get(cmd) || client.commands.find(c => c.aliases && c.aliases.includes(cmd));
    if (command) {
        console.log(`Executing command: ${command.name}`.green);
        if (command.owner) {
            if (!config.ownerIDS.includes(message.author.id)) return message.reply(`❌ **Only the owners of this bot can execute this command!**\n**Bot owners:** ${config.ownerIDS.map(ownerid => `<@${ownerid}>`)}`)
        }
        if(command.premium){
            if(client.dbAvailable && data && data.premium){
                if(data.premium > Date.now()) {
                    // Premium is active, continue
                } else {
                    return message.reply("❌ **Your premium subscription has expired!**")
                }
            } else {
                return message.reply("❌ **This is a premium command!**")
            }
        }


        if(command.permisos_bot){
            if(!message.guild.members.me.permissions.has(command.permisos_bot)) return message.reply(`❌ **I don't have enough permissions to execute this command!**\nI need the following permissions ${command.permisos_bot.map(permission => `\`${permission}\``).join(", ")}`)
        }

        if(command.permisos){
            if(!message.member.permissions.has(command.permisos)) return message.reply(`❌ **You don't have enough permissions to execute this command!**\nYou need the following permissions ${command.permisos.map(permission => `\`${permission}\``).join(", ")}`)
        }

        //execute the command
        try {
            console.log(`About to execute command: ${command.name}`.blue);
            await command.run(client, message, args, prefix, data?.idioma || 'en');
            console.log(`Command executed successfully: ${command.name}`.green);
        } catch (error) {
            console.log(`Command error:`.red, error);
            message.reply('❌ An error occurred while executing the command!');
        }
    } else {
        console.log(`Command not found: ${cmd}`.red);
        return message.reply("❌ I couldn't find the command you specified!");
    }

}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
