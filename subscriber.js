const zmq = require('zeromq');
const addresses = require('./addresses.json');
const transactions = require('./transactions.json');
const config = require('./config');

async function run() {
    const sock = new zmq.Subscriber

    sock.connect(`${config.URL}:${config.PORT}`);
    console.info(`Subscriber connected to port ${config.PORT}`);

    addresses.addresses.forEach((address) => {
        sock.subscribe(`${address}:balance`);
        sock.subscribe(`${address}:transaction`);
    });

    transactions.transactions.forEach((hash) => {
        sock.subscribe(hash);
    });


    for await (const [topic, msg] of sock) {
        console.info(`Received a message related to topic: "${topic.toString()}" containing message: ${msg.toString()}`)
    }
}

run()
