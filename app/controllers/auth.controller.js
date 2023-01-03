const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const refer = db.refer;
const Role = db.role;
var request = require('request');
const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  // Save User to Database
  try {

    const user = await User.create({
      name:req.body.name,
      phone:req.body.phone,
      username: req.body.username,
      email: req.body.email,
      address: req.body.address,
      dob: req.body.dob,
      gender: req.body.gender,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    if (req.body.refer !==null) {
      const reffer = await refer.create({
        username:req.body.username,
        newuserid:req.body.refer,
      });
    }
    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });

      const result = user.setRoles(roles);
      // if (result) res.send({ status: "1", message: "User registered successfully!" });
    } else {
      // user has role = 1
      const result = user.setRoles([1]);
      // if (result) res.send({ status: "1", message: "User registered successfully!" });
    }
    // var options = {
    //   'method': 'POST',
    //   'url': 'https://integration.mcd.5starcompany.com.ng/api/reseller/virtual-account2',
    //   'headers': {
    //     'Authorization': 'mcd_key_yhij3dui0678iujk23hegwtfyu23dwky'
    //   },
    //   formData: {
    //     'account_name': req.body.name,
    //     'business_short_name': 'SAVEBILLS',
    //     'uniqueid': req.body.username+Math.floor((Math.random() * 10000) + 1),
    //     'email': req.body.email,
    //     'phone': req.body.phone,
    //     'webhook_url': 'https://app.savebills.com.ng/api/auth/run'
    //   }
    // };
    // request(options, function (error, response) {
    //   if (error) throw new Error(error);
    //   var data=JSON.parse(response.body);
    //   console.log(response.body);
    //   console.log(data);
    //   const objectToUpdate = {
    //     account_number: data.data.account_number,
    //     account_name: data.data.customer_name,
    //   };
    //
    //   User.findAll({ where: { username: req.body.username}}).then((result) => {
    //     if(result){
    //       result[0].set(objectToUpdate);
    //       result[0].save();
    //     }
    //   })
    //
    //
    //
    //
    //
    // })

    var option = {
      'method': 'POST',
      'url': 'https://integration.mcd.5starcompany.com.ng/api/reseller/virtual-account3',
      'headers': {
        'Authorization': 'mcd_key_yhij3dui0678iujk23hegwtfyu23dwky'
      },
      formData: {
        'account_name': req.body.name,
        'business_short_name': 'SAVEBILLS',
        'uniqueid': req.body.username+Math.floor((Math.random() * 10000) + 1),
        'email': req.body.email,
        'dob': req.body.dob,
        'address': req.body.address,
        'gender': req.body.gender,
        'phone': req.body.phone,
        'webhook_url': 'https://server.savebills.com.ng/api/auth/run1'
      }
    };
    request(option, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);


      var data=JSON.parse(response.body);
      console.log(response.body);
      console.log(data);
      const objectToUpdate = {
        account_number1: data.data.account_number,
        account_name1: data.data.customer_name,
      };

      User.findAll({ where: { username: req.body.username}}).then((result) => {
        if(result){
          result[0].set(objectToUpdate);
          result[0].save();
        }
      })

      return  res.send({ status: "1", message: "User registered successfully!" });

    });

  } catch (error) {
    res.status(500).send({status: "1", message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(200).send({status: "0", message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
    );

    if (!passwordIsValid) {
      return res.status(200).send({
        status: "0",
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    // req.session.token = token;

    return res.status(200).send({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      roles: authorities,
      token: token,
    });
  } catch (error) {
    return res.status(200).send({ message: error.message });
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!"
    });
  } catch (err) {
    this.next(err);
  }
};
