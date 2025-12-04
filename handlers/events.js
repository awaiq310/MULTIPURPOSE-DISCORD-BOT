const fs = require('fs');
const allevents = [];
module.exports = async (client) => {
    try {
        console.log("Loading events...".yellow)
        let count = 0;
        const load_dir = (dir) => {
            const event_files = fs.readdirSync(`./eventos/${dir}`).filter((file) => file.endsWith('.js'));
            for(const file of event_files){
                try {
                    const event = require(`../eventos/${dir}/${file}`);
                    const event_name = file.split(".")[0];
                    
                    // Check if event is already registered to prevent duplicates
                    if (!allevents.includes(event_name)) {
                        allevents.push(event_name);
                        client.removeAllListeners(event_name); // Remove any existing listeners
                        
                        if (typeof event === 'function') {
                            client.on(event_name, event.bind(null, client));
                        } else if (event.execute && typeof event.execute === 'function') {
                            client.on(event_name, (...args) => event.execute(...args, client));
                        }
                        count++
                    }
                } catch(e){
                    console.log(`Error loading event ${file}:`.red, e.message)
                }
            }
        }
        ["client", "guild"].forEach(e => load_dir(e));
        console.log(`${count} Events Loaded`.brightGreen);
        console.log(`Starting Bot Session...`.yellow)
    } catch (e){
        console.log('Events handler error:'.red, e.message)
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Developed by awaiq310 || - ||           ║
╚═════════════════════════════════════════════════════╝
*/
