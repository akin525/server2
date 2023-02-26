const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const refer = db.refer;
const Role = db.role;
var request = require('request');
const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

exports.google = async (req, res) => {
    try {
        const check= await User.findOne({
            where:{
                email:req.body.email,
            },
        });

        if (!check){
            const user = await User.create({
                name:req.body.name,
                phone:"update your phone number",
                username: req.body.name+Math.floor((Math.random() * 10000) + 1),
                email: req.body.email,
                address: 'lagos nigeria',
                dob: req.body.dob,
                gender: req.body.gender,
                password: bcrypt.hashSync(req.body.password, 8),
            });

            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400, // 24 hours
            });

            var option = {
                'method': 'POST',
                'url': 'https://integration.mcd.5starcompany.com.ng/api/reseller/virtual-account3',
                'headers': {
                    'Authorization': 'mcd_key_yhij3dui0678iujk23hegwtfyu23dwky'
                },
                formData: {
                    'account_name': req.body.name,
                    'business_short_name': 'SAVEBILLS',
                    'uniqueid': req.body.name+Math.floor((Math.random() * 10000) + 1),
                    'email': req.body.email,
                    'dob': "male",
                    'address': "lagos nigeria",
                    'gender': "male",
                    'phone': "08146"+Math.floor(Math.random() * (99999 - 11111 )),
                    'webhook_url': 'https://server.savebills.com.ng/api/auth/run1'
                }
            };
            request(option, function (error, response) {
                if (error) throw new Error(error);
                console.log(response.body);


                var data=JSON.parse(response.body);
                console.log(response.body);
                console.log(data);
                const objectToUpdate = {
                    account_number1: data.data.account_number,
                    account_name1: data.data.customer_name,
                };

                User.findAll({ where: { username: req.body.username}}).then((result) => {
                    if(result){
                        result[0].set(objectToUpdate);
                        result[0].save();
                    }
                })

                return res.status(200).send({
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    token: token,
                });
            })
        }else {
            const token = jwt.sign({ id: check.id }, config.secret, {
                expiresIn: 86400, // 24 hours
            });
            return res.status(200).send({
                id: check.id,
                name: check.name,
                username: check.username,
                email: check.email,
                token: token,
            });
        }

    }catch (error) {
        return res.status(200).send({ message: error.message });
    }
}