const zmq = require('zeromq');
const addresses = require('./addresses.json');
const transactions = require('./transactions.json');
const config = require('./config');

function addDelay(delay = 500) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

async function run() {
    const sock = new zmq.Publisher

    await sock.bind(`${config.URL}:${config.PORT}`);
    console.info(`Publisher bound to port ${config.PORT}`);

    while (true) {

        for (const address of addresses.addresses) {
            console.info(`Sending balance changes for address: ${address}`);

            // Publish <address:balance> changes
            await sock.send([`${address}:balance`, Math.floor(Math.random() * 2000) + 1]);

            await addDelay();

            // Publish <address:transaction> changes i.e., when new transaction appears
            var hash = transactions.transactions[Math.floor(Math.random() * transactions.transactions.length)];
            console.info(`Sending new transaction hash: ${hash} for address: ${address}`);
            await sock.send([`${address}:transaction`, hash]);
        }

        await addDelay(3000);

        for (const hash of transactions.transactions) {
            console.info(`Sending transaction confirmation state for transaction hash: ${hash}`);

            // Publish <transaction> changes
            await sock.send([hash, Math.random() >= 0.5]);
        }
    }
}

run()