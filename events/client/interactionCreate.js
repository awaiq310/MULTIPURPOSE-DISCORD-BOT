const Discord = require('discord.js');
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);
const ticketSchema = require(`${process.cwd()}/modelos/tickets.js`);

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isButton()) return;

        // Check database availability
        if (!client.dbAvailable) {
            return interaction.reply({ content: '❌ **Database is not available. Please try again later.**', ephemeral: true });
        }

        if (interaction.customId === 'crear_ticket') {
            try {
                const setup = await setupSchema.findOne({ guildID: interaction.guild.id });
                if (!setup || !setup.sistema_tickets || !setup.sistema_tickets.canal) {
                    return interaction.reply({ content: '❌ **Ticket system is not configured!**', ephemeral: true });
                }

                // Check if user already has a ticket
                const existingTicket = await ticketSchema.findOne({
                    guildID: interaction.guild.id,
                    autor: interaction.user.id,
                    cerrado: false
                });

                if (existingTicket) {
                    const existingChannel = interaction.guild.channels.cache.get(existingTicket.canal);
                    if (existingChannel) {
                        return interaction.reply({ content: `❌ **You already have an open ticket! <#${existingTicket.canal}>**`, ephemeral: true });
                    } else {
                        // Channel doesn't exist, mark ticket as closed
                        await ticketSchema.findOneAndUpdate(
                            { _id: existingTicket._id },
                            { cerrado: true }
                        );
                    }
                }

                // Create ticket channel
                const ticketChannel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    type: Discord.ChannelType.GuildText,
                    parent: interaction.channel.parent,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [Discord.PermissionFlagsBits.ViewChannel]
                        },
                        {
                            id: interaction.user.id,
                            allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ReadMessageHistory]
                        },
                        {
                            id: client.user.id,
                            allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ManageChannels]
                        }
                    ]
                });

                // Save ticket to database
                const newTicket = new ticketSchema({
                    guildID: interaction.guild.id,
                    autor: interaction.user.id,
                    canal: ticketChannel.id,
                    cerrado: false
                });
                await newTicket.save();

                // Send ticket message
                const ticketEmbed = new Discord.EmbedBuilder()
                    .setTitle('🎫 Support Ticket')
                    .setDescription(`Hello ${interaction.user}, welcome to your support ticket!\nPlease describe your issue and wait for staff assistance.`)
                    .setColor(client.color)
                    .setTimestamp();

                const closeButton = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('cerrar_ticket')
                            .setLabel('Close Ticket')
                            .setEmoji('🔒')
                            .setStyle(Discord.ButtonStyle.Danger)
                    );

                await ticketChannel.send({
                    content: `${interaction.user}`,
                    embeds: [ticketEmbed],
                    components: [closeButton]
                });

                return interaction.reply({ content: `✅ **Ticket created successfully! <#${ticketChannel.id}>**`, ephemeral: true });
            } catch (error) {
                console.error('Error creating ticket:', error);
                return interaction.reply({ content: '❌ **An error occurred while creating the ticket. Please try again later.**', ephemeral: true });
            }
        }

        if (interaction.customId === 'cerrar_ticket') {
            try {
                const ticket = await ticketSchema.findOne({
                    guildID: interaction.guild.id,
                    canal: interaction.channel.id,
                    cerrado: false
                });

                if (!ticket) {
                    return interaction.reply({ content: '❌ **This is not a valid ticket channel!**', ephemeral: true });
                }

                // Update ticket as closed
                await ticketSchema.findOneAndUpdate(
                    { guildID: interaction.guild.id, canal: interaction.channel.id },
                    { cerrado: true }
                );

                const closeEmbed = new Discord.EmbedBuilder()
                    .setTitle('🔒 Ticket Closed')
                    .setDescription('This ticket has been closed. The channel will be deleted in 5 seconds.')
                    .setColor('#ff0000')
                    .setTimestamp();

                await interaction.reply({ embeds: [closeEmbed] });

                setTimeout(() => {
                    interaction.channel.delete().catch(console.error);
                }, 5000);
            } catch (error) {
                console.error('Error closing ticket:', error);
                return interaction.reply({ content: '❌ **An error occurred while closing the ticket.**', ephemeral: true });
            }
        }
    }
};