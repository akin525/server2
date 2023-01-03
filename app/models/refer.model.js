module.exports = (sequelize, Sequelize) => {
    const refer = sequelize.define("deposits",{

        username: {
            type:Sequelize
        },
        newuserid:{
            type:Sequelize
        },
        status:{
            type:Sequelize
        },


    });

    return refer;
};
