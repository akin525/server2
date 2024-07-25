const db = require("../models");
const User = db.user;
const safe =db.safelock;
const deposit=db.deposit;
const chat=db.message;
var request = require('request');
const {response} = require("express");
const {where, Op} = require("sequelize");

exports.chatapi =  async (req, res) => {

  const {senderId, recipientId}=req.body;

  try {

    const history = await chat.findAll({
      where: {
        [Op.or]: [
          {
            senderId: senderId,
            recipientId: recipientId,
          },
          {
            senderId: recipientId,
            recipientId: senderId,
          }
        ]
      }
    });

    return res.status(200).send({status:1,data:{ message:history}});
  } catch (error) {
    return res.status(500).send({message: error.message});
  }

};
