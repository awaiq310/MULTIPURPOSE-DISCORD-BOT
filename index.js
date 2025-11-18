const Discord = require('discord.js');
const config = require('./config/config.json')
const fs = require('fs');
require('colors')
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildEmojisAndStickers,
    ],
    partials: [Discord.Partials.User, Discord.Partials.Channel, Discord.Partials.GuildMember, Discord.Partials.Message, Discord.Partials.Reaction]

})

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.color = config.color;

/* LANGUAGE SYSTEM */
client.la = {};
let languages = fs.readdirSync('./idiomas').filter(file => file.endsWith(".json")).map(language => language.replace(/.json/, ""));
for(const language of languages){
    client.la[language] = require(`./idiomas/${language}`)
}
Object.freeze(client.la);

//Load the handlers
fs.readdirSync('./handlers').forEach(handler => {
    try {
        require(`./handlers/${handler}`)(client, Discord);
    } catch (e) {
        console.log(`ERROR IN HANDLER ${handler}`.red)
        console.log(e)
    }
});

client.login(config.token).catch(() => console.log(`-[X]- YOU HAVEN'T SPECIFIED A VALID TOKEN OR YOU'RE MISSING INTENTS -[X]-\n [-] ENABLE INTENTS AT https://discord.dev [-]`.red))

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
