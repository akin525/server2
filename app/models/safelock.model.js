module.exports = (sequelize, Sequelize) => {
    const safelock = sequelize.define("safe_locks", {

        username: {
            type: Sequelize.STRING
        },
        tittle: {
            type: Sequelize.STRING
        },
        balance: {
            type: Sequelize
        },
        date: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING
        },
        transactionid: {
            type: Sequelize.STRING
        },
        paymentmethod: {
            type: Sequelize.STRING
        },

    });

    return safelock;
};