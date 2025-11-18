const serverSchema = require(`${process.cwd()}/modelos/servidor.js`);
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);
const warnSchema = require(`${process.cwd()}/modelos/warns.js`);
const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
const config = require(`${process.cwd()}/config/config.json`);
const Discord = require('discord.js')

module.exports = {
    ensure_all,
    pagination
}

async function ensure_all(guildid, userid, client) {
    // Skip database operations if database is not available
    if (!client || !client.dbAvailable) {
        return null;
    }
    
    try {
        if (guildid) {
            let serverdata = await serverSchema.findOne({ guildID: guildid }).maxTimeMS(3000);
            if (!serverdata) {
                console.log(`Ensured: Server Config`.green);
                serverdata = await new serverSchema({
                    guildID: guildid,
                    prefijo: config.prefix
                });
                await serverdata.save();
            }
            let setupsdata = await setupSchema.findOne({ guildID: guildid }).maxTimeMS(3000);
            if (!setupsdata) {
                console.log(`Ensured: Setups`.green);
                setupsdata = await new setupSchema({
                    guildID: guildid,
                    reaccion_roles: [],
                });
                await setupsdata.save();
            }
        }
        if (userid) {
            let ecodata = await ecoSchema.findOne({ userID: userid }).maxTimeMS(3000);
            if (!ecodata) {
                console.log(`Ensured: Economy for ${userid}`.green);
                ecodata = await new ecoSchema({
                    userID: userid
                });
                await ecodata.save();
            }
        }
        if(guildid && userid){
            let warn_data = await warnSchema.findOne({ guildID: guildid, userID: userid }).maxTimeMS(3000);
            if (!warn_data) {
                console.log(`Ensured: Warnings for ${userid} in ${guildid}`.green);
                warn_data = await new warnSchema({
                    guildID: guildid,
                    userID: userid,
                    warnings: [],
                });
                await warn_data.save();
            }
        }
    } catch (error) {
        console.log(`Database error in ensure_all:`.red, error.message);
        // Don't throw error, just return null to allow bot to continue
        return null;
    }
}


//define the pagination function
async function pagination(client, message, text, title = "Pagination", elements_per_page = 5) {

    /* DIVIDE THE TEXT TO CREATE PAGES AND PUSH IT INTO EMBEDS */

    var embeds = [];
    var divided = elements_per_page;
    for(let i = 0; i < text.length; i+= divided) {
        let desc = text.slice(i, elements_per_page);
        elements_per_page+= divided;
        //create an embed for each page of divided data
        let embed = new Discord.EmbedBuilder()
        .setTitle(title.toString())
        .setDescription(desc.join(" "))
        .setColor(client.color)
        .setThumbnail(message.guild.iconURL({dynamic: true}))
        embeds.push(embed)
    }

    let currentPage = 0;
    //If the number of embeds is only 1, send the message as is without buttons
    if (embeds.length === 1) return message.channel.send({ embeds: [embeds[0]] }).catch(() => { });
    //If the number of embeds is greater than 1, do the rest || define the buttons.
    let back_button = new Discord.ButtonBuilder().setStyle('Success').setCustomId('Back').setEmoji('⬅').setLabel('Back')
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
        //If the user clicking the button is not the same one who wrote the command, we respond that only the person who wrote the command can change pages
        if (b?.user.id !== message.author.id) return b?.reply({ content: `❌ **Only the person who wrote the command can change pages!` });

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
        embedPages.edit({ content: `Time has expired!`, embeds: [embeds[currentPage].setFooter({ text: `Page ${currentPage + 1} / ${embeds.length}` })], components: [embedPages.components[0]] }).catch(() => { });
    });
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
