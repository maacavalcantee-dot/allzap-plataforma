const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox'] }
});

client.on('qr', (qr) => {
    console.log('QR Code received', qr);
    io.emit('qr', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
    io.emit('ready', 'WhatsApp Connected');
});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

client.initialize();

server.listen(3001, () => {
    console.log('SERVER RUNNING ON PORT 3001');
});