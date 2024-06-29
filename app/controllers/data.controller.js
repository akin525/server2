const db = require("../models");
const User = db.user;
const bill= db.bill;
const data=db.data;
const datanew=db.datanew;
const Server=db.dataserver;
var request = require('request');
const {response} = require("express");

exports.data =  async (req, res) => {
    const userid = req.body.userId;
    var boy;
    try {
        let authorities = [];


        const allplan= await datanew.findAll({
            where:{
                network:req.body.network,
                status:'1',
            },
        });

        // console.log(allplan);
        return res.status(200).send({
            status:1,
            data:{
               plan: allplan
            }
        });

    } catch (error) {
        return res.status(201).send({
            message: error.message});
    }


};
exports.datanew =  async (req, res) => {
    var boy;
    try {



        const server = await Server.findOne({
            where:{
                status:1,
            },
        });


        let allplan=[];
        if (req.body.network === "smile") {
             allplan = await datanew.findAll({
                where: {
                    network: req.body.network,
                    // category:req.body.category,
                    status: '1',
                },
            });
        }else {
             allplan = await datanew.findAll({
                where: {
                    network: req.body.network,
                    // category:req.body.category,
                    status: '1',
                    server: server.code,
                },
            });
        }

        // console.log(allplan);
        return res.status(200).send({
            status:1,
            data:{
               plan: allplan
            }
        });

    } catch (error) {
        return res.status(201).send({
            message: error.message});
    }

    res.status(200).send("User Content.");

};
exports.datapin=  async (req, res) => {
    var boy;
    try {



        const server = await Server.findOne({
            where:{
                status:1,
            },
        });


        const allplan= await datanew.findAll({
            where:{
                network:req.body.network,
                // category:req.body.category,
                status:'1'
            },
        });

        // console.log(allplan);
        return res.status(200).send({
            status:1,
            data:{
               plan: allplan
            }
        });

    } catch (error) {
        return res.status(201).send({
            message: error.message});
    }

    res.status(200).send("User Content.");

};
