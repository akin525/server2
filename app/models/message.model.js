module.exports = (sequelize, Sequelize) => {
    const message = sequelize.define("messages",{

        message: {
            type:Sequelize
        },
        status:{
            type:Sequelize
        },


    });

    return message;
};
