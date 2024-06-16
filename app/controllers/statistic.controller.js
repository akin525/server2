const db = require("../models");
const sequelize = require("sequelize");
const {validationResult} = require("express-validator");
const User = db.user;
const deposit=db.deposit;
const bill= db.bill;

exports.statistic = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({
            status: 0,
            msg: 'Errors',
            errors: errors.array()
        });
    }

    const userid = req.body.userId;
    const year = req.body.year;
    const mode = req.body.mode;

    try {
        const user = await User.findOne({
            where: {
                id: userid,
            },
        });

        if (!user) {
            return res.status(200).send({status: "0", message: "Kindly login your account."});
        }

        // Build the date filter for the specific year and month
        let dateFilter = {};
        // if (year && month) {
        //     dateFilter = {
        //         date: {
        //             [sequelize.Op.and]: [
        //                 sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year),
        //                 sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month)
        //             ]
        //         }
        //     };
        // } else
        if (mode === "month") {
            dateFilter = {
                date: sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year)
            };
        }

        const deposits = await deposit.findAll({
            where: {
                username: user.username,
                ...dateFilter
            },
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%m-%Y'), 'month'],
                [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']
            ],
            group: [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%m-%Y')],
            order: [[sequelize.literal('DATE_FORMAT(date, "%Y-%m")'), 'ASC']]
        });

        const totaldeposit = await deposit.sum('amount', {
            where: {
                username: user.username,
                ...dateFilter
            },
        });

        const purchases = await bill.findAll({
            where: {
                username: user.username,
                ...dateFilter
            },
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%m-%Y'), 'month'],
                [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']
            ],
            group: [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%m-%Y')],
            order: [[sequelize.literal('DATE_FORMAT(date, "%Y-%m")'), 'ASC']]
        });

        const totalbill = await bill.sum('amount', {
            where: {
                username: user.username,
                ...dateFilter
            },
        });

        return res.status(200).send({
            status: 1,
            data: {
                income: deposits,
                totalincome: totaldeposit ?? 0,
                expense: purchases,
                totalexpense: totalbill ?? 0
            }
        });
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
};

