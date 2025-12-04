const setupSchema = require(`${process.cwd()}/modelos/setups.js`);

module.exports = client => {
    client.on('messageReactionAdd', async (reaction, user) => {
        if (user.bot || !client.dbAvailable) return;
        
        const setup = await setupSchema.findOne({ guildID: reaction.message.guild.id });
        if (!setup || !setup.reaccion_roles) return;
        
        const reactionRole = setup.reaccion_roles.find(r => r.mensaje === reaction.message.id && r.emoji === reaction.emoji.name);
        if (reactionRole) {
            const member = reaction.message.guild.members.cache.get(user.id);
            const role = reaction.message.guild.roles.cache.get(reactionRole.rol);
            if (member && role) member.roles.add(role).catch(console.error);
        }
    });
    
    client.on('messageReactionRemove', async (reaction, user) => {
        if (user.bot || !client.dbAvailable) return;
        
        const setup = await setupSchema.findOne({ guildID: reaction.message.guild.id });
        if (!setup || !setup.reaccion_roles) return;
        
        const reactionRole = setup.reaccion_roles.find(r => r.mensaje === reaction.message.id && r.emoji === reaction.emoji.name);
        if (reactionRole) {
            const member = reaction.message.guild.members.cache.get(user.id);
            const role = reaction.message.guild.roles.cache.get(reactionRole.rol);
            if (member && role) member.roles.remove(role).catch(console.error);
        }
    });
    
    console.log('Reaction roles system loaded successfully'.green);
};