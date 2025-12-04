const setupSchema = require(`${process.cwd()}/modelos/setups.js`);
const ticketSchema = require(`${process.cwd()}/modelos/tickets.js`);

module.exports = client => {
    console.log('Tickets system loaded successfully'.green);
};