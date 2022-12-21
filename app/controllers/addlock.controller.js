const db = require("../models");
const User = db.user;
const safe =db.safelock;
const deposit=db.deposit;
var request = require('request');
const {response} = require("express");
const {where} = require("sequelize");

exports.profile =  async (req, res) => {
  const userid = req.body.userId;

  var boy;
  try {
    let authorities = [];
    var amount=req.body.amount;

    const user = await User.findOne({
      where: {
        id: userid,
      },
    });

    if (!user) {
      // req.session = null;
      return res.status(200).send({status: "0", message: "Kindly login your account."});
    }

    const add =await safe.findOne({
      where:{
        id:req.body.id,
      },
    });

    var main=add.amount +req.body.amount;

    const objectToUpdate = {
     amount:main,
    }
    User.findAll({ where: { id: add.id}}).then((result) => {
      if(result){
        result[0].set(objectToUpdate);
        result[0].save();
      }
    })

    return res.status(200).send({
      status:"1",
      message:"Amount added successfully",
    });

  } catch (error) {
    return res.status(201).send({
      message: error.message});
  }

};
