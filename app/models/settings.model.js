module.exports = (sequelize, Sequelize) => {
    const settings= sequelize.define("settings",{
        email: {
            type: Sequelize
        },
        charges:{
            type: Sequelize
        },
        encryption:{
            type: Sequelize
        },

        squadco:{
            type: Sequelize
        },
        squadco_key:{
            type: Sequelize
        },
    });

    return settings;
};
