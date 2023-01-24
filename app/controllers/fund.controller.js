const db = require("../models");
const User = db.user;
const bill= db.bill;
const deposit=db.deposit;
var request = require('request');
const {response} = require("express");
const {where} = require("sequelize");
const { body, validationResult } = require('express-validator');
const nodemailer = require("nodemailer");

exports.fund =  async (req, res) => {
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

        if (req.body.amount < 0)
        {
            return res.status(200).send({
                status: "0",
                message: "invalid transaction"
            });
        }




        var options = {
            'method': 'POST',
            'url': 'https://api.budpay.com/api/v2/transaction/initialize',
            'headers': {
                'Authorization': 'Bearer sk_test_f5n6aovwjbqjo6ipwffwjjhg0btgwqge43fg8vm'
            },
            formData: {
                'email': user.email,
                'amount': req.body.amount,
                'callback': 'youcallbackurl'
            }
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            var data=JSON.parse(response.body);
            // console.log(data.success);
            if (data.status=="true"){
                console.log(data);

                return   res.status(200).send({
                    status: "1",
                    data:data.data,
                    url:data.data.authoriza+tion_url,
                });
            }
            // res.status(200).send(response.body);

        });

        //

    } catch (error) {
        return res.status(201).send({
            message: error.message});
    }


};
