const db = require("../models");
const {use} = require("express/lib/router");
const User = db.user;
const bill= db.bill;
const refer= db.refer;
const deposit=db.deposit;
const lock =db.safelock;
exports.dashboard =  async (req, res) => {
    const userid = req.userId;
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
        const totalbill= await bill.sum('amount',{
            where:{
                username:user.username,
            },
        });
        const totaldeposit=await deposit.sum('amount', {
            where:{
                username:user.username,
            },
        });

        const allbill =await bill.findAll({
            where:{
                username:user.username,
            },
        });
        const allock = await lock.sum('balance',{
            where:{
                username:user.username,
            },
        });

        const referbonus= await refer.sum('amount', {
            where:{
                username:user.username,
                status:"1",
            },
        });

        return res.status(200).send({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            phone: user.phone,
            wallet: parseInt(user.wallet),
            account_number: user.account_number,
            account_number1: user.account_number1,
            account_name: user.account_name,
            account_name1: user.account_name1,
            totalbill:totalbill??0,
            totaldeposit:totaldeposit??0,
            allock:allock??0,
            bills:allbill,
            referbonus:referbonus??0,
            roles: authorities
        });
    } catch (error) {
        return res.status(500).send({message: error.message});
    }

    res.status(200).send("User Content.");

};
