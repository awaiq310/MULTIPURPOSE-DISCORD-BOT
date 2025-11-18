const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
module.exports = {
    name: "deposit",
    aliases: ["dep"],
    desc: "Used to deposit money in the bank",
    run: async (client, message, args, prefix) => {
        //read user's economy data
        let data = await ecoSchema.findOne({userID: message.author.id});
        let amount = args[0];
        //previous checks
        if(["all", "all-in", "everything"].includes(args[0])) {
            amount = data.dinero
        } else {
            if(isNaN(amount) || amount <= 0 || amount % 1 != 0) return message.reply("❌ **You have not specified a valid amount to deposit!**");
            if(amount > data.dinero) return message.reply("❌ **You do not have that much money to deposit!**");
        }
       await ecoSchema.findOneAndUpdate({userID: message.author.id}, {
           $inc: {
               dinero: -amount,
               banco: amount
           }
       });
       return message.reply(`✅ **You deposited \`${amount} coins\` in your bank!**`);
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/