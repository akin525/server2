module.exports = (sequelize, Sequelize) => {
    const message = sequelize.define("messes",{

        message: {
            type:Sequelize
        },
        status:{
            type:Sequelize
        },


    });

    return message;
};
