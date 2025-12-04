const Discord = require('discord.js');
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);

module.exports = {
    name: "setup-reactionrole",
    aliases: ["setup-reactionroles", "setup-reaccionroles", "setup-reaccionrol", "setupreactionroles", "reactionrolessetup"],
    desc: "Used to create a reaction role system",
    permisos: ["Administrator"],
    permisos_bot: ["ManageRoles", "ManageChannels"],
    run: async (client, message, args, prefix) => {
        var contador = 0;
        var finalizado = false;

        var objeto = {
            ID_MENSAJE: "",
            ID_CANAL: "",
            Parametros: []
        }

        emoji()
        async function emoji(){
            contador++;
            if(contador === 23) return finalizar();
            var parametros = {
                Emoji: "",
                Emojimsg: "",
                Rol: "",
                msg: "",
            };

            let preguntar = await message.reply({
                embeds: [new Discord.EmbedBuilder()
                .setTitle(`What emoji do you want to use for the \`${contador}º\` role?`)
                .setDescription(`*React to **__this message__** with the desired emoji!*\n\nType \`finish\` to end the setup!`)
                .setColor(client.color)
            ]
            });
            preguntar.awaitReactions({
                filter: (reaction, user) => {
                    return user.id === message.author.id && !finalizado;
                },
                max: 1,
                errors: ["time"],
                time: 180e3
            }).then(collected => {
                if(collected.first().emoji.id && collected.first().emoji.id.length > 2){
                    preguntar.delete();
                    parametros.Emoji = collected.first().emoji.id;
                    if(collected.first().emoji.animated){
                        parametros.Emoji = `<a:${collected.first().emoji.id}>`
                    } else {
                        parametros.Emoji = `<:${collected.first().emoji.id}>`
                    }
                    return rol()
                } else if(collected.first().emoji.name){
                    preguntar.delete();
                    parametros.Emoji = collected.first().emoji.name;
                    parametros.Emojimsg = collected.first().emoji.name;
                    return rol();
                } else {
                    message.reply(`Cancelled and finishing setup...`)
                    return finalizar();
                }
            }).catch(() => {
                return finalizar();
            });

            preguntar.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                errors: ["time"],
                time: 180e3
            }).then(collected => {
                if((collected.first().content.toLowerCase() === "finalizar" || collected.first().content.toLowerCase() === "finish") && !finalizado){
                    finalizado = true;
                    return finalizar();
                }
            }).catch(() => {
                return finalizar();
            });

            async function rol(){
                let querol = await message.reply({
                    embeds: [new Discord.EmbedBuilder()
                    .setTitle(`What role do you want to use for the selected emoji?`)
                    .setDescription(`*Simply mention the role or write its ID!*`)
                    .setColor(client.color)
                    ]
                });
                await querol.channel.awaitMessages({
                    filter: m => m.author.id === message.author.id,
                    max: 1,
                    errors: ["time"],
                    time: 180e3
                }).then(async collected => {
                    var message = collected.first();
                    const rol = message.guild.roles.cache.get(message.content) || message.mentions.roles.filter(r => r.guild.id == message.guild.id).first();
                    if(rol) {
                        parametros.Rol = rol.id;
                        objeto.Parametros.push(parametros);

                        querol.delete().catch(() => {});

                        return emoji();
                    } else {
                        return message.reply(`❌ **The Role you mentioned DOES NOT EXIST!**\nSetup cancelled!`)
                    }
                }).catch(() => {
                    return finalizar();
                })
            }
        }

        async function finalizar() {
            if(contador === 1 && !objeto.Parametros.length) return message.reply(`❌ **You have to add at least one emoji with a role**\nSetup cancelled!`);
            let msg = await message.reply({
                embeds: [new Discord.EmbedBuilder()
                .setTitle(`Specify Channel`)
                .setDescription(`⬇ Mention or write the ID of the channel for the message to react to! ⬇`)
                .setColor(client.color)
                ]
            })
            await msg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                errors: ["time"],
                time: 180e3,
            }).then(async collected => {
                var message = collected.first();
                const canal = message.guild.channels.cache.get(message.content) || message.mentions.channels.filter(c => c.guild.id == message.guild.id).first()
                if(canal) {
                    objeto.ID_CANAL = canal.id

                    var idmensaje = await message.reply({
                        embeds: [new Discord.EmbedBuilder()
                            .setTitle(`Specify Message`)
                            .setDescription(`⬇ Write the ID of the message to add reactions to! ⬇`)
                            .setColor(client.color)
                        ]
                    });
                    await idmensaje.channel.awaitMessages({
                        filter: m => m.author.id === message.author.id,
                        max: 1,
                        errors: ["time"],
                        time: 180e3,
                    }).then(async collected => {
                        var message = collected.first();
                        const found = await message.guild.channels.cache.get(objeto.ID_CANAL).messages.fetch(message.content);
                        if(found){
                            for(var i = 0; i < objeto.Parametros.length; i++){
                                found.react(objeto.Parametros[i].Emoji).catch(() => {console.log("NO SE HA PODIDO AÑADIR LA REACCIÓN")})
                            }
                            objeto.ID_MENSAJE = message.content;
                            let setupdatos = await setupSchema.findOne({guildID: message.guild.id});
                            setupdatos.reaccion_roles.push(objeto);
                            setupdatos.save();
                            return message.reply(`Reaction Role Setup Created ✅\nYou can create another setup by running the command \`${prefix}setup-reactionroles\``)
                        } else {
                            return message.reply(`❌ **The message you specified was not found!**\nSetup cancelled!`)
                        }
                    }).catch((e) => {
                        return message.reply(`Your time has expired!`)
                    })
                } else {
                    return message.reply(`❌ **The channel you specified was not found!**\nSetup cancelled!`)
                }
            }).catch((e) => {
                return message.reply(`Your time has expired!`)
            })
        }
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
