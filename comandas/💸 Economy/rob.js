const { ensure_all } = require(`${process.cwd()}/utils/funciones.js`);
const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
const duration = require('humanize-duration');
module.exports = {
    name: "rob",
    aliases: ["steal"],
    desc: "Used to steal coins from a user",
    run: async (client, message, args, prefix) => {
        if (!args.length) return message.reply("❌ **You have to specify the user to rob!**")
        const user = message.guild.members.cache.get(args[0]) || message.mentions.members.filter(m => m.guild.id == message.guild.id).first();
        if (!user) return message.reply("❌ **The user you specified was not found**")
        //ensure user's economy
        await ensure_all(null, user.id, client);
        //read user's economy data
        let data = await ecoSchema.findOne({ userID: message.author.id });
        //define cooldown time in MS
        let time_ms = 5 * 60 * 1000; // 5 minutes
        //previous checks
        if (time_ms - (Date.now() - data.rob) > 0) {
            let remaining_time = duration(Date.now() - data.rob - time_ms,
                {
                    language: "en",
                    units: ["h", "m", "s"],
                    round: true,
                })
            return message.reply(`🕑 **You have to wait \`${remaining_time}\` to rob a user again!**`)
        }
        let user_data = await ecoSchema.findOne({ userID: user.id });
        if (user_data.dinero < 500) return message.reply("❌ **You cannot rob the user as they have less than \`500 coins\`**")
        let amount = Math.floor(Math.random() * 400) + 100
        //previous checks
        if (amount > user_data.dinero) return message.reply("❌ **The user does not have enough money to be robbed!**")
        //remove coins from user's wallet and add to ours, adding the date when "rob" command was executed
        await ecoSchema.findOneAndUpdate({ userID: message.author.id }, {
            $inc: {
                dinero: amount
            },
            rob: Date.now()
        })
        //remove coins from user's wallet
        await ecoSchema.findOneAndUpdate({ userID: user.id }, {
            $inc: {
                dinero: -amount
            },
        })
        return message.reply(`✅ **You robbed \`${amount} coins\` from \`${user.user.tag}\`**`)
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/