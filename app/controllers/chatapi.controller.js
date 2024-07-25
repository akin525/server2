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
    const { senderId, recipientId } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const history = await chat.findAll({
      where: {
        [Op.or]: [
          { senderId, recipientId },
          { senderId: recipientId, recipientId: senderId }
        ]
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']] // Sort by createdAt, adjust as needed
    });

    return res.status(200).send({
      status: 1,
      data: {
        message: history,
        currentPage: page,
        totalPages: Math.ceil(await chat.count({
          where: {
            [Op.or]: [
              { senderId, recipientId },
              { senderId: recipientId, recipientId: senderId }
            ]
          }
        }) / limit)
      }
    });
  } catch (error) {
    return res.status(500).send({message: error.message});
  }

};
