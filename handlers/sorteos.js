const sorteosSchema = require(`${process.cwd()}/modelos/sorteos.js`);
const Discord = require('discord.js');

module.exports = async client => {
    // Wait for database connection
    const checkDB = () => {
        if (!client.dbAvailable) {
            setTimeout(checkDB, 1000);
            return;
        }
        startGiveawaySystem();
    };
    
    const startGiveawaySystem = () => {
    
    setInterval(async () => {
        const sorteos = await sorteosSchema.find({ finalizado: false });
        
        for (const sorteo of sorteos) {
            if (Date.now() >= sorteo.tiempo) {
                const canal = client.channels.cache.get(sorteo.canal);
                if (!canal) continue;
                
                try {
                    const mensaje = await canal.messages.fetch(sorteo.mensaje);
                    const reacciones = mensaje.reactions.cache.get('🎉');
                    
                    if (reacciones) {
                        const usuarios = await reacciones.users.fetch();
                        const participantes = usuarios.filter(u => !u.bot);
                        
                        if (participantes.size > 0) {
                            const ganador = participantes.random();
                            const embed = new Discord.EmbedBuilder()
                                .setTitle('🎉 Sorteo Finalizado')
                                .setDescription(`**Ganador:** ${ganador}\n**Premio:** ${sorteo.premio}`)
                                .setColor(client.color);
                            
                            await canal.send({ embeds: [embed] });
                        }
                    }
                    
                    await sorteosSchema.findOneAndUpdate(
                        { _id: sorteo._id },
                        { finalizado: true }
                    );
                } catch (error) {
                    console.error('Error ending giveaway:', error);
                }
            }
        }
    }, 10000);
    
        console.log('Giveaways system loaded successfully'.green);
    };
    
    checkDB();
};
