const mongoose = require('mongoose');
const config = require('../../config/config.json');

module.exports = async client => {
    let palo = 53;
    
    // Initialize database availability flag
    client.dbAvailable = false;

    // Database connection with retry logic
    let retries = 3;
    let connected = false;
    
    while (retries > 0 && !connected) {
        try {
            mongoose.set('strictQuery', false);
            
            // Add connection event listeners
            mongoose.connection.on('connected', () => {
                console.log('Mongoose connected to MongoDB');
            });
            
            mongoose.connection.on('error', (err) => {
                console.log('Mongoose connection error:', err.message);
            });
            
            mongoose.connection.on('disconnected', () => {
                console.log('Mongoose disconnected');
                client.dbAvailable = false;
            });
            
            await mongoose.connect(config.mongodb, {
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                family: 4, // Use IPv4, skip trying IPv6
                bufferCommands: false
            });
            
            console.log(`
╔═════════════════════════════════════════════════════╗
║                                                     ║
║       Connected to MONGODB database!              ║
║                                                     ║
╚═════════════════════════════════════════════════════╝`.blue)
            
            // Set global database availability flag
            client.dbAvailable = true;
            connected = true;
            
        } catch (err) {
            retries--;
            console.log(`Database connection attempt failed. Retries left: ${retries}`.yellow);
            console.log(`Database error: ${err.message}`.red);
            
            if (retries > 0) {
                console.log('Retrying in 5 seconds...'.yellow);
                await new Promise(resolve => setTimeout(resolve, 5000));
            } else {
                console.log(`☁ Database connection failed after all retries - Bot will work without database features`.yellow);
                client.dbAvailable = false;
            }
        }
    }

    console.log(`╔═════════════════════════════════════════════════════╗`.green)
    console.log(`║ `.green + " ".repeat(-1 + palo - 1) + " ║".green)
    console.log(`║ `.green + `      Connected as ${client.user.tag}`.green + " ".repeat(-1 + palo - 1 - `      Connected as ${client.user.tag}`.length) + " ║".green)
    console.log(`║ `.green + " ".repeat(-1 + palo - 1) + " ║".green)
    console.log(`╚═════════════════════════════════════════════════════╝`.green)
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/