const db = require("../models");
const User = db.user;
const safe =db.safelock;
const deposit=db.deposit;
const chat=db.message;
var request = require('request');
const {response} = require("express");
const {where, Op} = require("sequelize");

exports.adminchatapi = async (req, res) => {
  try {
    const history = await chat.findAll({
      where: {
        [Op.or]: [
          {
            senderId: 0,
            recipientId: { [Op.ne]: 0 },
          },
          {
            recipientId: 0,
            senderId: { [Op.ne]: 0 },
          },
        ],
      },
      order: [['id', 'DESC']], // Ensure the latest records come first
    });

    // Create a map to track the last record for each unique (senderId, recipientId) pair
    const uniqueChatsMap = new Map();
    history.forEach(chat => {
      const pair = `${chat.senderId}-${chat.recipientId}`;
      if (!uniqueChatsMap.has(pair)) {
        uniqueChatsMap.set(pair, chat);
      }
    });

    const uniqueChats = Array.from(uniqueChatsMap.values());

    return res.status(200).send({ status: 1, chats: uniqueChats });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};


