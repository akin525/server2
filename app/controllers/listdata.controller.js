const db = require("../models");
const User = db.user;
const bill= db.bill;
const data3=db.data;
var request = require('request');
const {response} = require("express");
const axios = require('axios');

exports.listdata = async (req, res) => {
    try {
        const options = {
            method: 'POST',
            url: 'https://integration.mcd.5starcompany.com.ng/api/reseller/list',
            headers: {
                'Authorization': 'mcd_key_yhij3dui0678iujk23hegwtfyu23dwky'
            },
            data: {
                service: 'data',
                coded:"m"
            }
        };

        const response = await axios(options);
        const data = response.data.data; // Assuming the response contains JSON data

        const processedData = data.map(process => {
            return {
                plan_id: process.code,
                network: process.type,
                plan: process.name,
                code: process.code,
                amount: process.amount,
                tamount: process.amount,
                ramount: process.amount
            };
        });

        // Assuming 'data3' is a model you want to use for saving data to a database
        // Assuming 'create' is a method to create a new record
        for (const process of processedData) {
            await data3.create(process);
        }

        return res.status(200).json(response.data.data);
    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
};
