const db = require("../models");
const User = db.user;
const safe =db.safelock;
const deposit=db.deposit;
var request = require('request');
const {response} = require("express");
const {where} = require("sequelize");
const {validationResult} = require("express-validator");

exports.reward =  async (req, res) => {
  const decryptedData = req.decryptedData;
  const errors = validationResult(decryptedData);
  if (!errors.isEmpty()) {
    return res.status(200).json({
      status: 0,
      msg: 'Errors',
      errors: errors.array()
    });
  }
  const { userId,  amount, } = decryptedData;
  const userid = userId;

  var boy;
  try {
    let authorities = [];

    const user = await User.findOne({
      where: {
        id: userid,
      },
    });

    if (!user) {
      // req.session = null;
      return res.status(200).send({status: "0", message: "Kindly login your account."});
    }
    if(amount===""){
      return res.status(200).send({status: "0", message: "Kindly enter your amount."});

    }



    const rebalance=parseInt(user.reward)+parseInt(req.body.amount);

    const user1 = await User.update(
        { reward: rebalance },
        {
          where: {
            id: userid,
          },
        });


    return res.status(200).send({
      status:1,
      data:{
        message:"Amount added successfully"
      }

    });

  } catch (error) {
    return res.status(201).send({
      message: error.message});
  }

};
