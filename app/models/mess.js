const {DataTypes} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const mess = sequelize.define("messes",{

        message: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status:{
            type:Sequelize
        },


    });

    return mess;
};
