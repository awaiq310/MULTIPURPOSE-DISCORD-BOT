const Discord = require('discord.js');
module.exports = {
    name: "queue",
    aliases: ["q", "list"],
    desc: "Used to view the song list",
    run: async (client, message, args, prefix) => {
        if (!client.distube) {
            return message.reply(`❌ **Music system is currently disabled!**\nTo enable music, install the required dependencies:\n\`npm install @discordjs/opus @distube/soundcloud @distube/spotify distube libsodium-wrappers\``);
        }
        //previous checks
        const queue = client.distube.getQueue(message);
        if (!queue) return message.reply(`❌ **No song is playing!**`);
        if (!message.member.voice?.channel) return message.reply(`❌ **You have to be in a voice channel to execute this command!**`);
        if (message.guild.members.me.voice?.channel && message.member.voice?.channel.id != message.guild.members.me.voice?.channel.id) return message.reply(`❌ **You have to be in the same voice channel __AS ME__ to execute this command!**`);

        let queueList = []; //create an empty array where all songs will be added
        var maxSongs = 10; //These will be the maximum songs shown per page.
        //map all songs and add them to the queueList array
        for (let i = 0; i < queue.songs.length; i += maxSongs) {
            let songs = queue.songs.slice(i, i + maxSongs);
            queueList.push(songs.map((song, index) => `**\`${i + ++index}\`** - [\`${song.name}\`](${song.url})`).join("\n "));
        }

        var limit = queueList.length;
        var embeds = [];
        //Loop through all songs up to the limit
        for (let i = 0; i < limit; i++) {
            let desc = String(queueList[i]).substring(0, 2048); //Make sure the message length is less than 2048, to avoid errors.
            //Create an embed for every 10 songs
            let embed = new Discord.EmbedBuilder()
                .setTitle(`🎶 ${message.guild.name} Queue - \`[${queue.songs.length} ${queue.songs.length > 1 ? "Songs" : "Song"}]\``)
                .setColor("#8400ff")
                .setDescription(desc)
            //If the number of songs to show is greater than one, then we specify in the embed which song is currently playing.
            if (queue.songs.length > 1) embed.addFields([{name: `💿 Current Song`, value: `**[\`${queue.songs[0].name}\`](${queue.songs[0].url})**`}, ])
            await embeds.push(embed)
        }
        return pagination();

        //define the pagination function
        async function pagination() {
            let currentPage = 0;
            //If the number of embeds is only 1, send the message as is without buttons
            if (embeds.length === 1) return message.channel.send({ embeds: [embeds[0]] }).catch(() => { });
            //If the number of embeds is greater than 1, do the rest || define the buttons.
            let back_button = new Discord.ButtonBuilder().setStyle('Success').setCustomId('Back').setEmoji('⬅️').setLabel('Back')
            let home_button = new Discord.ButtonBuilder().setStyle('Danger').setCustomId('Home').setEmoji('🏠').setLabel('Home')
            let forward_button = new Discord.ButtonBuilder().setStyle('Success').setCustomId('Forward').setEmoji('➡️').setLabel('Forward')
            //Send the embed message with buttons
            let embedPages = await message.channel.send({
                content: `**Click the __Buttons__ to change pages**`,
                embeds: [embeds[0].setFooter({ text: `Page ${currentPage + 1} / ${embeds.length}` })],
                components: [new Discord.ActionRowBuilder().addComponents([back_button, home_button, forward_button])]
            });
            //Create a collector and filter that the person clicking the button is the same one who issued the command, and that the author of the page message is the client
            const collector = embedPages.createMessageComponentCollector({ filter: i => i?.isButton() && i?.user && i?.user.id == message.author.id && i?.message.author.id == client.user.id, time: 180e3 });
            //Listen to collector events
            collector.on("collect", async b => {
                //If the user clicking the button is not the same one who wrote the command, we respond that only the person who wrote >>queue can change pages
                if (b?.user.id !== message.author.id) return b?.reply({ content: `❌ **Only the person who wrote \`${prefix}queue\` can change pages!` });

                switch (b?.customId) {
                    case "Back": {
                        //Reset the collector timer
                        collector.resetTimer();
                        //If the page to go back is not equal to the first page then we go back
                        if (currentPage !== 0) {
                            //Reset the current page value -1
                            currentPage -= 1
                            //Edit the embeds
                            await embedPages.edit({ embeds: [embeds[currentPage].setFooter({ text: `Page ${currentPage + 1} / ${embeds.length}` })], components: [embedPages.components[0]] }).catch(() => { });
                            await b?.deferUpdate();
                        } else {
                            //Reset to the number of embeds - 1
                            currentPage = embeds.length - 1
                            //Edit the embeds
                            await embedPages.edit({ embeds: [embeds[currentPage].setFooter({ text: `Page ${currentPage + 1} / ${embeds.length}` })], components: [embedPages.components[0]] }).catch(() => { });
                            await b?.deferUpdate();
                        }
                    }
                        break;

                    case "Home": {
                        //Reset the collector timer
                        collector.resetTimer();
                        //If the page to go back is not equal to the first page then we go back
                        currentPage = 0;
                        await embedPages.edit({ embeds: [embeds[currentPage].setFooter({ text: `Page ${currentPage + 1} / ${embeds.length}` })], components: [embedPages.components[0]] }).catch(() => { });
                        await b?.deferUpdate();
                    }
                        break;

                    case "Forward": {
                        //Reset the collector timer
                        collector.resetTimer();
                        //If the page to advance is not the last one, then we advance one page
                        if (currentPage < embeds.length - 1) {
                            //Increase the current page value +1
                            currentPage++
                            //Edit the embeds
                            await embedPages.edit({ embeds: [embeds[currentPage].setFooter({ text: `Page ${currentPage + 1} / ${embeds.length}` })], components: [embedPages.components[0]] }).catch(() => { });
                            await b?.deferUpdate();
                        //In case it's the last one, we go back to the first
                        } else {
                            //Reset to the number of embeds - 1
                            currentPage = 0
                            //Edit the embeds
                            await embedPages.edit({ embeds: [embeds[currentPage].setFooter({ text: `Page ${currentPage + 1} / ${embeds.length}` })], components: [embedPages.components[0]] }).catch(() => { });
                            await b?.deferUpdate();
                        }
                    }
                        break;

                    default:
                        break;
                }
            });
            collector.on("end", () => {
                //disable buttons and edit the message
                embedPages.components[0].components.map(button => button.disabled = true)
                embedPages.edit({content: `Time has expired! type \`${prefix}queue\` again to see the song queue again!`, embeds: [embeds[currentPage].setFooter({ text: `Page ${currentPage + 1} / ${embeds.length}` })], components: [embedPages.components[0]] }).catch(() => { });
            });
        }
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
