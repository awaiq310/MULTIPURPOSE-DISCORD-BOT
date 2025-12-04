const Discord = require('discord.js');
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);

module.exports = {
    name: "setup-ticket",
    aliases: ["ticket-setup", "setupticket", "ticketsetup"],
    desc: "Used to create a Ticket system",
    permisos: ["Administrator"],
    permisos_bot: ["ManageRoles", "ManageChannels"],
    run: async (client, message, args, prefix) => {
        var objeto = {
            canal: "",
            mensaje: "",
        };

        const quecanal = await message.reply({
            embeds: [new Discord.EmbedBuilder()
            .setTitle(`What channel do you want to use for the ticket system?`)
            .setDescription(`*Simply mention the channel or send its ID!*`)
            .setColor(client.color)
            ]
        });

        await quecanal.channel.awaitMessages({
            filter: m=> m.author.id === message.author.id,
            max: 1,
            errors: ["time"],
            time: 180e3
        }).then(async collected => {
            var message = collected.first();
            const channel = message.guild.channels.cache.get(message.content) || message.mentions.channels.filter(c => c.guild.id == message.guild.id).first()
            if(channel) {
                objeto.canal = channel.id;
                const quemensaje = await message.reply({
                    embeds: [new Discord.EmbedBuilder()
                    .setTitle(`What message do you want to use for the ticket system?`)
                    .setDescription(`*Simply send the message!*`)
                    .setColor(client.color)
                    ]
                });
                await quemensaje.channel.awaitMessages({
                    filter: m=> m.author.id === message.author.id,
                    max: 1,
                    errors: ["time"],
                    time: 180e3
                }).then(async collected => {
                    var message = collected.first();
                    const msg = await message.guild.channels.cache.get(objeto.canal).send({
                        embeds: [new Discord.EmbedBuilder()
                            .setTitle(`📥 Create a Ticket`)
                            .setDescription(`${message.content.substring(0, 2048)}`)
                            .setColor(client.color)
                        ],
                        components: [new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setLabel("Create a ticket").setEmoji("📨").setCustomId("crear_ticket").setStyle("Success"))]
                    })
                    objeto.mensaje = msg.id
                    await setupSchema.findOneAndUpdate(
                        {guildID: message.guild.id}, 
                        {sistema_tickets: objeto},
                        {upsert: true, new: true}
                    );
                    return message.reply(`✅ **Successfully configured in <#${objeto.canal}>**`)
                }).catch((e) => {
                    return message.reply("❌ **Time has expired!**")
                })
            } else {
                return message.reply("❌ **The channel you specified was not found!**")
            }
        }).catch((e) => {
            return message.reply("❌ **Time has expired!**")
        })

    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
