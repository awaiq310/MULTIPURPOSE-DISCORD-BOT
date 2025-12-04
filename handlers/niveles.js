const Discord = require('discord.js');
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);

module.exports = client => {
    client.on('messageCreate', async message => {
        if (!message.guild || message.author.bot || !client.dbAvailable) return;
        
        const setup = await setupSchema.findOne({ guildID: message.guild.id });
        if (!setup || !setup.niveles || !setup.niveles.canal) return;
        
        // Add XP logic here
        const xpGain = Math.floor(Math.random() * 15) + 10;
        // Implementation would go here
    });
    
    console.log('Levels system loaded successfully'.green);
};


