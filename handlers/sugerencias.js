const setupSchema = require(`${process.cwd()}/modelos/setups.js`);
const Discord = require('discord.js');

module.exports = client => {
    const checkDB = () => {
        if (!client.dbAvailable) {
            setTimeout(checkDB, 1000);
            return;
        }
        startSuggestionsSystem();
    };
    
    const startSuggestionsSystem = () => {
        client.on('messageCreate', async message => {
            if (!message.guild || message.author.bot) return;
            
            const setup = await setupSchema.findOne({ guildID: message.guild.id });
            if (!setup || !setup.sugerencias || setup.sugerencias !== message.channel.id) return;
            
            await message.react('👍');
            await message.react('👎');
        });
        
        console.log('Suggestions system loaded successfully'.green);
    };
    
    checkDB();
};