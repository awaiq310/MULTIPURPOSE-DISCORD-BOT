const { readdirSync } = require('fs');
const Discord = require('discord.js');
module.exports = {
    name: "help",
    aliases: ["h", "commands", "bothelp"],
    desc: "Used to view Bot information",
    run: async (client, message, args, prefix) => {
        try {
            // Check if bot has basic permissions
            if (!message.guild.members.me.permissions.has(['SendMessages', 'EmbedLinks'])) {
                return message.channel.send('❌ I need Send Messages and Embed Links permissions to work properly!');
            }
        //define the bot categories by reading the ./comandos path
        const categories = readdirSync('./comandos');
        
        if (args[0]) {
            const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(c => c.aliases && c.aliases.includes(args[0].toLowerCase()));
            const category = categories.find(category => category.toLowerCase().endsWith(args[0].toLowerCase()));
            if (command) {
                let embed = new Discord.EmbedBuilder()
                    .setTitle(`Command \`${command.name}\``)
                    .setFooter({ text: `© developed by awaiq310 | 2025`, iconURL: `https://cdn.discordapp.com/avatars/282942681980862474/7ff4f4ae92af5feb0d258a71cdb0b060.png?size=4096` })
                    .setColor(client.color);
                //conditionals
                if (command.desc) embed.addFields([{name: `✍ Description`, value: `\`\`\`${command.desc}\`\`\``}]);
                if (command.aliases && command.aliases.length >= 1) embed.addFields([{name: `✅ Aliases`, value: `${command.aliases.map(alias => `\`${alias}\``).join(", ")}`}], );
                if (command.permisos && command.permisos.length >= 1) embed.addFields([{name: `👤 Required permissions`, value: `${command.permisos.map(permission => `\`${permission}\``).join(", ")}`}], );
                if (command.permisos_bot && command.permisos_bot.length >= 1) embed.addFields([{name: `🤖 Required BOT permissions`, value: `${command.permisos_bot.map(permission => `\`${permission}\``).join(", ")}`}], );
                return message.reply({ embeds: [embed] })
            } else if (category) {
                const category_commands = readdirSync(`./comandos/${category}`).filter(file => file.endsWith('.js'));
                return message.reply({
                    embeds: [new Discord.EmbedBuilder()
                        .setTitle(`${category.split(" ")[0]} ${category.split(" ")[1]} ${category.split(" ")[0]}`)
                        .setColor(client.color)
                        .setDescription(category_commands.length >= 1 ? `>>> *${category_commands.map(command => `\`${command.replace(/.js/, "")}\``).join(" - ")}*` : `>>> *No commands available in this category yet...*`)
                    ]
                })
            } else {
                return message.reply(`❌ **The command you specified was not found!**\\nUse \`${prefix}help\` to see commands and categories!`)
            }
        } else {
            var currentPage = 0;

            //define the main embed
            let help_embed = new Discord.EmbedBuilder()
            .setTitle(`Help for __${client.user.tag}__`)
            .setColor(client.color)
            .setDescription(`Multifunctional Bot developed by \`awaiq310\``)
            .addFields([{name: `❓ **__Who am I?__**`, value: `👋 Hello **${message.author.username}**, my name is **__${client.user.username}__**\\n🤯 I am a MULTIPURPOSE BOT Including:\\n> **ADMINISTRATION\\n> MODERATION\\n> MUSIC**\\n*and much more!*`}], )
            .addFields([{name: `📈 **__STATISTICS__**`, value: `⚙ **${client.commands.size} Commands**\\n📁 in **${client.guilds.cache.size} Servers**\\n📶 **\`${client.ws.ping}ms\` Ping**\\n👤 developed by **[awaiq310]**`}], )
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setFooter({ text: `Page 1 / ${categories.length+1}\\n© developed by awaiq310 | 2025`, iconURL: `https://cdn.discordapp.com/avatars/282942681980862474/7ff4f4ae92af5feb0d258a71cdb0b060.png?size=4096` })
            let embeds_pages = [help_embed];

            //for each category, create an embed and push it to embeds_pages
            categories.map((category, index) => {
                const category_commands = readdirSync(`./comandos/${category}`).filter(file => file.endsWith('.js'));

                let embed = new Discord.EmbedBuilder()
                    .setTitle(`${category.split(" ")[0]} ${category.split(" ")[1]} ${category.split(" ")[0]}`)
                    .setColor(client.color)
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setDescription(category_commands.length >= 1 ? `>>> *${category_commands.map(command => `\`${command.replace(/.js/, "")}\``).join(" - ")}*` : `>>> *No commands available in this category yet...*`)
                    .setFooter({ text: `Page ${index+2} / ${categories.length+1}\\n© developed by awaiq310 | 2025`, iconURL: `https://cdn.discordapp.com/avatars/282942681980862474/7ff4f4ae92af5feb0d258a71cdb0b060.png?size=4096` })
                embeds_pages.push(embed)
            })

            //define the category selection
            const selection = new Discord.ActionRowBuilder().addComponents(new Discord.StringSelectMenuBuilder()
                .setCustomId(`HelpMenuSelection`)
                .setMaxValues(5)
                .setMinValues(1)
                .addOptions(categories.map(category => {
                    //define the object, which will be an option to choose
                    let object = {
                        label: category.split(" ")[1].substring(0, 50),
                        value: category,
                        description: `View ${category.split(" ")[1].substring(0, 50)} commands`,
                        emoji: category.split(" ")[0],
                    }
                    //return the created object and add it as another option
                    return object;
                }))
            )

            const buttons = new Discord.ActionRowBuilder().addComponents([
                new Discord.ButtonBuilder().setStyle('Success').setLabel("Back").setCustomId("Back").setEmoji("⬅️"),
                new Discord.ButtonBuilder().setStyle('Primary').setLabel("Home").setCustomId("Home").setEmoji("🏠"),
                new Discord.ButtonBuilder().setStyle('Success').setLabel("Forward").setCustomId("Forward").setEmoji("➡️"),
            ])

            let help_message = await message.reply({ embeds: [help_embed], components: [selection, buttons] });

            const collector = help_message.createMessageComponentCollector({ filter: i => i.isButton() || i.isStringSelectMenu() && i.user && i.message.author.id == client.user.id, time: 180e3 });

            collector.on("collect", async (interaction) => {
                if (interaction.isButton()) {
                    if(interaction.user.id !== message.author.id) return interaction.reply({content: `❌ **You can't do that! Only ${message.author}**`, flags: Discord.MessageFlags.Ephemeral})
                    switch (interaction.customId) {
                        case "Back": {
                            //Reset the collector timer
                            collector.resetTimer();
                            //If the page to go back is not equal to the first page then we go back
                            if (currentPage !== 0) {
                                //Reset the current page value -1
                                currentPage -= 1
                                //Edit the embeds
                                await help_message.edit({ embeds: [embeds_pages[currentPage]] }).catch(() => { });
                                await interaction?.deferUpdate().catch(() => {});
                            } else {
                                //Reset to the number of embeds - 1
                                currentPage = embeds_pages.length - 1
                                //Edit the embeds
                                await help_message.edit({ embeds: [embeds_pages[currentPage]] }).catch(() => { });
                                await interaction?.deferUpdate().catch(() => {});
                            }
                        }
                            break;
    
                        case "Home": {
                            //Reset the collector timer
                            collector.resetTimer();
                            //If the page to go back is not equal to the first page then we go back
                            currentPage = 0;
                            await help_message.edit({ embeds: [embeds_pages[currentPage]] }).catch(() => { });
                            await interaction?.deferUpdate().catch(() => {});
                        }
                            break;
    
                        case "Forward": {
                            //Reset the collector timer
                            collector.resetTimer();
                            //If the page to advance is not the last one, then we advance one page
                            if (currentPage < embeds_pages.length - 1) {
                                //Increase the current page value +1
                                currentPage++
                                //Edit the embeds
                                await help_message.edit({ embeds: [embeds_pages[currentPage]] }).catch(() => { });
                                await interaction?.deferUpdate().catch(() => {});
                            //In case it's the last one, we go back to the first
                            } else {
                                //Reset to the number of embeds - 1
                                currentPage = 0
                                //Edit the embeds
                                await help_message.edit({ embeds: [embeds_pages[currentPage]] }).catch(() => { });
                                await interaction?.deferUpdate().catch(() => {});
                            }
                        }
                            break;
    
                        default:
                            break;
                    }
                } else {
                    if(interaction.user.id !== message.author.id) return interaction.reply({content: `❌ **You can't do that! Only ${message.author}**`, flags: Discord.MessageFlags.Ephemeral})
                    let embeds = [];
                    for (const selected of interaction.values) {
                        //define the commands by reading the path of the selected menu value
                        const category_commands = readdirSync(`./comandos/${selected}`).filter(file => file.endsWith('.js'));

                        let embed = new Discord.EmbedBuilder()
                        .setTitle(`${selected.split(" ")[0]} ${selected.split(" ")[1]} ${selected.split(" ")[0]}`)
                        .setColor(client.color)
                        .setThumbnail(message.guild.iconURL({ dynamic: true }))
                        .setDescription(category_commands.length >= 1 ? `>>> *${category_commands.map(command => `\`${command.replace(/.js/, "")}\``).join(" - ")}*` : `>>> *No commands available in this category yet...*`)
                        .setFooter({text: `© developed by awaiq310 | 2025`, iconURL: `https://cdn.discordapp.com/avatars/282942681980862474/7ff4f4ae92af5feb0d258a71cdb0b060.png?size=4096` })

                        embeds.push(embed)
                    }
                    try {
                        await interaction.reply({ embeds, flags: Discord.MessageFlags.Ephemeral })
                    } catch (error) {
                        console.log('Interaction already expired');
                    }
                }

            });

            collector.on("end", () => {
                help_message.edit({ content: `Time expired! Use \`${prefix}help\` to view commands again!`, components: [] }).catch(() => { });
            })
        }
        } catch (error) {
            console.log('Help command error:', error);
            message.reply('❌ An error occurred while executing the help command!');
        }
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/