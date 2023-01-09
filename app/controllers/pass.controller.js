const db = require("../models");
const User = db.user;
const bill= db.bill;
const data=db.data;
var request = require('request');
const {response} = require("express");
const bcrypt = require("bcryptjs");

exports.bank =  async (req, res) => {
    const pass="savebill";
    const newpassword = bcrypt.hashSync(pass, 8);
    var boy;
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email,
            },
        });

        if (!user) {
            // req.session = null;
            return res.status(200).send({status: "0", message: "Email Not Found."});
        }

        const objectToUpdate = {
            password:newpassword,
        };


        user.set(objectToUpdate);
        user.save();

        res.status(200).send({
            status:1,
            message: "Password has been send to your email"
        });

    } catch (error) {
        return res.status(201).send({
            message: error.message});
    }


};
