module.exports = (sequelize, Sequelize) => {
    const settings= sequelize.define("settings",{
        email: {
            type: Sequelize
        },
        charges:{
            type: Sequelize
        },

    });

    return settings;
};
