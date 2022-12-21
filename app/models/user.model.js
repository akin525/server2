module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {

    name: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    wallet: {
      type: Sequelize.STRING
    },
    account_number: {
      type: Sequelize.STRING
    },
    account_name: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    }
  });

  return User;
};
