const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
module.exports = {
    name: "bet",
    aliases: ["gamble"],
    desc: "Used to bet an amount of money",
    run: async (client, message, args, prefix) => {
        //read user's economy data
        let data = await ecoSchema.findOne({ userID: message.author.id });
        let amount = args[0];
        //previous checks
        if (["all", "all-in", "everything"].includes(args[0])) {
            amount = data.dinero
        } else {
            if (isNaN(amount) || amount <= 0 || amount % 1 != 0) return message.reply("❌ **You have not specified a valid amount to bet!**");
            if (amount > data.dinero) return message.reply("❌ **You do not have that much money to bet!**");
        }
        //create possibilities
        let possibilities = ["win", "lose"];
        //define result of possibilities
        let result = possibilities[Math.floor(Math.random() * possibilities.length)];
        //if result is win, person wins what they bet, but if lose, person loses what they bet
        if (result === "win") {
            await ecoSchema.findOneAndUpdate({ userID: message.author.id }, {
                $inc: {
                    dinero: parseInt(amount)
                }
            })
            return message.reply(`🎉 **You won \`${amount} coins\`**`)
        } else {
            await ecoSchema.findOneAndUpdate({ userID: message.author.id }, {
                $inc: {
                    dinero: -parseInt(amount)
                }
            })
            return message.reply(`💸 **You lost \`${amount} coins\`**`)
        }
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/