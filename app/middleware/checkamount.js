

checkamountcharacter = async (req, res, next) => {
  const { amount } = req.body;
  const specialCharPattern = /[-+]/;

  try {

    if (specialCharPattern.test(amount)) {
      return res.status(200).send({
        status:0,
        message: 'Special characters found',
        requestNumber: amount
      });
    }


    if (!amount) {
      return res.status(200).send({ status: 0, message: "Kindly enter your amount." });
    }

    if (amount < 100) {
      return res.status(200).send({ status: 0, message: "Amount must not be less than 100" });
    }


    next();
  } catch (error) {
    return res.status(500).send({
      status: "0",
      message: error.message
    });
  }
};


const checkamount = {
  checkamountcharacter
};

module.exports = checkamount;
