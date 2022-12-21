module.exports = (sequelize, Sequelize) => {
    const bill = sequelize.define("bos", {

        username: {
            type: Sequelize.STRING
        },
        plan: {
            type: Sequelize.STRING
        },
        amount: {
            type: Sequelize.STRING
        },
        result: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        refid: {
            type: Sequelize.STRING
        },
        date: {
            type: Sequelize.STRING
        },
        server_res:{
            type: Sequelize.STRING
        },
        token:{
            type: Sequelize.STRING
        },

    });

    return bill;
};
