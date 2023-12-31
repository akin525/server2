module.exports = (sequelize, Sequelize) => {
    const otp = sequelize.define("otp",{
        pin: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
    });
    return otp;
};
