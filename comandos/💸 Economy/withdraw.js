const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
module.exports = {
    name: "withdraw",
    aliases: ["wd"],
    desc: "Used to withdraw money from the bank",
    run: async (client, message, args, prefix) => {
        //read user's economy data
        let data = await ecoSchema.findOne({userID: message.author.id});
        let amount = args[0];
        //previous checks
        if(["all", "all-in", "everything"].includes(args[0])) {
            amount = data.banco
        } else {
            if(isNaN(amount) || amount <= 0 || amount % 1 != 0) return message.reply("❌ **You have not specified a valid amount to withdraw!**");
            if(amount > data.banco) return message.reply("❌ **You do not have that much money in the bank to withdraw!**");
        }
       await ecoSchema.findOneAndUpdate({userID: message.author.id}, {
           $inc: {
               banco: -amount,
               dinero: amount,
           }
       });
       return message.reply(`✅ **You withdrew \`${amount} coins\` from your bank!**`);
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/