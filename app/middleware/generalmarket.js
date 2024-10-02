const db = require("../models");
const User = db.user;
const Bill= db.bill;
const { format } = require('date-fns');
const { Op } = require('sequelize');

const checkMyTransaction = async (req, res, next) => {
    const { userId } = req.decryptedData; // Assuming userId is passed as a URL parameter

    try {
        const user = await User.findOne({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return res.status(200).send({ status: 0, message: "User not found." });
        }

        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        console.log("formattedDate");
        console.log(formattedDate);

        const transactionCount = await Bill.count({
            where: {
                username: user.username,
                createdAt: {
                    [Op.gte]: new Date(formattedDate),
                    [Op.lt]: new Date(new Date(formattedDate).setDate(new Date(formattedDate).getDate() + 1))
                }
            }
        });

        console.log("transactionCount");
        console.log(transactionCount);

        // if (transactionCount >= 2) {
            return { status: 1, message: "User has reached the transaction limit for today." };
        // } else {
        //     return { status: 2, message: "User has not reached the transaction limit for today." };
        // }

    } catch (error) {
        return res.status(500).send({
            status: "0",
            message: error.message
        });
    }
};

module.exports = {
    checkMyTransaction
};