const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    guildID: String,
    prefijo: String,
    premium: {type: String, default: ""},
    idioma: {type: String, default: "en"},
})

const model = mongoose.model("ConfigServer", serverSchema);

module.exports = model;

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by dewstouh#1088 || - ||      ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
