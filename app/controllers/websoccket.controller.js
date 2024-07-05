const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const db = require("../models");
const {get} = require("request");
const {Sequelize} = require("sequelize");
const Message =db.message
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        handleIncomingMessage(ws, parsedMessage);
    });

    ws.on('close', () => {
        // Handle disconnection if needed
    });
});

const handleIncomingMessage = async (ws, message) => {
    switch (message.type) {
        case 'REGISTER':
            clients.set(message.userId, ws);
            const chatHistory = await fetchChatHistory(message.userId);
            ws.send(JSON.stringify({ type: 'HISTORY', chatHistory }));
            break;
        case 'MESSAGE':
            const recipientWs = get(message.recipientId);
            if (recipientWs) {
                recipientWs.send(JSON.stringify(message));
            }
            await saveMessageToDatabase(message);
            break;
        case 'TYPING':
            const typingRecipientWs = get(message.recipientId);
            if (typingRecipientWs) {
                typingRecipientWs.send(JSON.stringify(message));
            }
            break;
        // Handle other message types as needed
    }
};

const saveMessageToDatabase = async (message) => {
    await Message.create({
        senderId: message.senderId,
        recipientId: message.recipientId,
        content: message.content
    });
};

const fetchChatHistory = async (userId) => {
    const messages = await Message.findAll({
        where: {
            [Sequelize.Op.or]: [
                { senderId: userId },
                { recipientId: userId }
            ]
        },
        order: [['timestamp', 'ASC']]
    });
    return messages.map(message => message.get({ plain: true }));
};

module.exports = {
    handleIncomingMessage,
    fetchChatHistory,
};