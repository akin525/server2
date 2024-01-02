const db = require("../models");
const User = db.user;
const safe =db.safelock;
const intt =db.interest;
const deposit=db.deposit;
var request = require('request');
const {response} = require("express");
const {where} = require("sequelize");
const bcrypt = require("bcryptjs");

exports.cpass=  async (req, res) => {
  const userid = req.body.userId;

  var boy;
  try {
    if(req.body.password===""){
      return res.status(200).send({status: "0", message: "Kindly enter your new password"});

    }
    if(req.body.cpassword===""){
      return res.status(200).send({status: "0", message: "Kindly enter your confirm password."});

    }
    if (req.body.password != req.body.cpassword){
      return res.status(200).send({status: "0", message: "Both password no match"});
    }
    const user = await User.findOne({
      where: {
        id: userid,
      },
    });

    if (!user) {
      // req.session = null;
      return res.status(200).send({status: "0", message: "Kindly login your account."});
    }
    const dat6 =new Date().toISOString().split('T')[0];




      const objectToUpdate = {
        password: bcrypt.hashSync(req.body.password, 8),

      };


      user.set(objectToUpdate);
      user.save();



    res.status(200).send({
      status: 1,
      message: "Password change successful",
    });
  } catch (error) {
    return res.status(201).send({
      message: error.message});
  }

};
