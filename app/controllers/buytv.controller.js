const db = require("../models");
const User = db.user;
const bill= db.bill;
const deposit=db.deposit;
const data=db.data;
var request = require('request');
const {response} = require("express");
const {where} = require("sequelize");

exports.buytv =  async (req, res) => {
    const userid = req.body.userId;

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

        const product= await data.findOne({
            where:{
                id:req.body.id,
            },
        });
        const amount=product.tamount;
        const o=User.wallet < product.tamount;
        console.log("user.wallet");
        console.log(user.wallet);
        console.log(product.tamount);
        if (parseInt(user.wallet) < parseInt(product.tamount))
        {
            return  res.status(200).send({
                status:"0",
                mu:o,
                se:product.tamount,
                balance:user.wallet,
                message:"insufficient balance"
            });
        }

        const totalbill= await bill.findOne({
            where:{
                refid:req.body.refid,
            },
        });
        if (totalbill)
        {
            return res.status(200).send({
                status: "0",
                message: "duplicate transaction"
            });
        }
        var tamount=parseInt(user.wallet) - parseInt(amount);

        const user1 = await User.update(
            { wallet: tamount },
            {
                where: {
                    id: userid,
                },

            });
        // console.log("user1");
        console.log(user1);

        const bil= await bill.create({
            username:user.username,
            plan:product.plan,
            amount:product.tamount,
            server_res:"data",
            result:"0",
            phone:req.body.number,
            refid:req.body.refid,

        });

        var options = {
            'method': 'POST',
            'url': 'https://integration.mcd.5starcompany.com.ng/api/reseller/pay',
            'headers': {
                'Authorization': 'mcd_key_yhij3dui0678iujk23hegwtfyu23dwky'
            },
            formData: {
                'service': 'tv',
                'coded': product.plan_id,
                'phone': req.body.number
            }
        };

        request(options, function (error, response) {
            if (error) console.log(error);
            var data=JSON.parse(response.body);
            console.log(data);
            if (data.success===1){
                console.log(data);

                const objectToUpdate = {
                    result:"1",
                    server_res:response.body

                }
                bill.findAll({ where: { id: bil.id}}).then((result) => {
                    if(result){
                        result[0].set(objectToUpdate);
                        result[0].save();
                    }
                })
                return   res.status(200).send({
                    status: "1",
                    user:user.username,
                    message:product.plan+" Was Successfully Delivered To "+req.body.number,
                    server_res:response.body
                });
            } else if (data.success===0) {
                const back =parseInt(user.wallet) + parseInt(amount);
                const user14 =  User.update(
                    { wallet: back },
                    {
                        where: {
                            id: userid,
                        },
                    });
                return   res.status(200).send({
                    status: "0",
                    message: data.message,
                    up:user14
                });
            }
            res.status(200).send(response.body);

        });


        //

    } catch (error) {
        return res.status(201).send({
            message: error.message});
    }


};
