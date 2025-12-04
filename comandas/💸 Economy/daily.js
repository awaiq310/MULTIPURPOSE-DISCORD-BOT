const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
const duration = require('humanize-duration');
module.exports = {
    name: "daily",
    aliases: ["reward"],
    desc: "Used to claim your daily reward",
    run: async (client, message, args, prefix) => {
        //read the user's economy
        let data = await ecoSchema.findOne({userID: message.author.id});
        //define how often the command can be executed IN MS
        let time_ms = 24 * 60 * 60 * 1000 // 86400000 ms
        let reward = 1200;
        //previous checks
        if(time_ms - (Date.now() - data.daily) > 0) {
            let remaining_time = duration(Date.now() - data.daily - time_ms,
            {
                language: "en",
                units: ["h", "m", "s"],
                round: true,
            })
            return message.reply(`🕑 **You have to wait \`${remaining_time}\` to claim your daily reward again!**`)
        }
        await ecoSchema.findOneAndUpdate({userID: message.author.id}, {
            $inc: {
                dinero: reward
            },
            daily: Date.now()
        })
        return message.reply(`✅ **You have claimed your daily reward of \`${reward} coins\`!**`)
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
