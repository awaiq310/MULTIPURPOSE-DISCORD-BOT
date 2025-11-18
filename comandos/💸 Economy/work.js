const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
const duration = require('humanize-duration');
var jobs = [
    "Truck Driver",
    "Developer", 
    "Mechanic",
    "Taxi Driver"
];
module.exports = {
    name: "work",
    aliases: ["job"],
    desc: "Used to work and earn coins every 3 hours",
    run: async (client, message, args, prefix) => {
        //read user's economy data
        let data = await ecoSchema.findOne({userID: message.author.id});
        //define cooldown time in MS
        let time_ms = 3 * 60 * 60 * 1000 // 10800000 ms
        //define random money reward, max 1000 coins, min 200
        let reward = Math.floor(Math.random() * 800) + 200;
        //define user's job
        let job = jobs[Math.floor(Math.random() * jobs.length)];
        //previous checks
        if(time_ms - (Date.now() - data.work) > 0) {
            let remaining_time = duration(Date.now() - data.work - time_ms,
            {
                language: "en",
                units: ["h", "m", "s"],
                round: true,
            })
            return message.reply(`🕑 **You have to wait \`${remaining_time}\` to work again!**`)
        }
        await ecoSchema.findOneAndUpdate({userID: message.author.id}, {
            $inc: {
                dinero: reward
            },
            work: Date.now()
        })
        return message.reply(`✅ **You worked as \`${job}\` and received a reward of \`${reward} coins\`!**`)
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/