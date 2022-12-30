const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
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
    var options = {
      'method': 'POST',
      'url': 'https://integration.mcd.5starcompany.com.ng/api/reseller/virtual-account2',
      'headers': {
        'Authorization': 'mcd_key_yhij3dui0678iujk23hegwtfyu23dwky'
      },
      formData: {
        'account_name': req.body.name,
        'business_short_name': 'SAVEBILLS',
        'uniqueid': req.body.username+Math.floor((Math.random() * 10000) + 1),
        'email': req.body.email,
        'phone': req.body.phone,
        'webhook_url': 'https://app.savebills.com.ng/api/auth/run'
      }
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      var data=JSON.parse(response.body);
      console.log(response.body);
      console.log(data);
      const objectToUpdate = {
        account_number: data.data.account_number,
        account_name: data.data.customer_name,
      };

      User.findAll({ where: { username: req.body.username}}).then((result) => {
        if(result){
          result[0].set(objectToUpdate);
          result[0].save();
        }
      })





      var nodemailer = require('nodemailer');

      var transporter = nodemailer.createTransport({
        host: 'primedata.com.ng',
        port: 465,
        secure: true, // use SSL
        auth: {
          user: 'admin@primedata.com.ng',
          pass: 'W3lcom32Z3f@prime'
        }
      });

      var mailOptions = {
        from: 'admin@primedata.com.ng',
        to: req.body.email,
        subject: 'New User',
        html: '<body style="width:100%;font-family:arial, \'helvetica neue\', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">\n' +
            '<div class="es-wrapper-color" style="background-color:#FAFAFA"><!--[if gte mso 9]>\\n' +
            '    <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">\\n' +
            '        <v:fill type="tile" color="#fafafa"></v:fill>\\n' +
            '    </v:background>\\n' +
            '    <![endif]-->\\n' +
            '    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA">\\n' +
            '        <tr>\\n' +
            '            <td valign="top" style="padding:0;Margin:0">\\n' +
            '                <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">\\n' +
            '                    <tr>\\n' +
            '                        <td align="center" style="padding:0;Margin:0">\\n' +
            '                            <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">\\n' +
            '                                <tr>\\n' +
            '                                    <td align="left" style="padding:0;Margin:0;padding-top:15px;padding-left:20px;padding-right:20px">\\n' +
            '                                        <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">\\n' +
            '                                            <tr>\\n' +
            '                                                <td align="center" valign="top" style="padding:0;Margin:0;width:560px">\\n' +
            '                                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">\\n' +
            '                                                        <tr>\\n' +
            '                                                            <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0px"><img src="https://primedata.com.ng/lg.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="100" height="100"></td>\\n' +
            '                                                        </tr>\\n' +
            '                                                        <tr>\\n' +
            '                                                            <td align="center" class="es-m-p0r es-m-p0l es-m-txt-c" style="Margin:0;padding-top:15px;padding-bottom:15px;padding-left:40px;padding-right:40px"><h1 style="Margin:0;line-height:30px;mso-line-height-rule:exactly;font-family:arial, \\helvetica neue\\, helvetica, sans-serif;font-size:25px;font-style:normal;font-weight:bold;color:#333333"><strong>New Signup</strong></h1></td>\\n' +
            '                                                        </tr>\\n' +
            '                                                        <tr>\\n' +
            '                                                            <td align="center" style="padding:0;Margin:0;padding-top:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \\helvetica neue\\, helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">Find Your Account Information Below</p>\\n' +
            '                                                                <ol>\\n' +
            '                                                                    <li style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \\helvetica neue\\, helvetica, sans-serif;line-height:21px;Margin-bottom:15px;margin-left:0;color:#333333;font-size:14px;text-align:left">name: ' + req.body.name+' </li>\\n' +
            '                                                                    <li style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \\helvetica neue\\, helvetica, sans-serif;line-height:21px;Margin-bottom:15px;margin-left:0;color:#333333;font-size:14px;text-align:left">Username: '+req.body.username+'</li>\\n' +
            '                                                                    <li style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \\helvetica neue\\, helvetica, sans-serif;line-height:21px;Margin-bottom:15px;margin-left:0;color:#333333;font-size:14px;text-align:left">Number: '+req.body.phone+'</li>\\n' +
            '                                                                    <li style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \\helvetica neue\\, helvetica, sans-serif;line-height:21px;Margin-bottom:15px;margin-left:0;color:#333333;font-size:14px;text-align:left">Wallet:₦0 </li>\\n' +
            '                                                                    <li style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \\helvetica neue\\, helvetica, sans-serif;line-height:21px;Margin-bottom:15px;margin-left:0;color:#333333;font-size:14px;text-align:left">Password: ' + req.body.password+'</li>\\n' +
            '                                                                    <li style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \\helvetica neue\\, helvetica, sans-serif;line-height:21px;Margin-bottom:15px;margin-left:0;color:#333333;font-size:14px;text-align:left">Account Number: ' + data.data.account_number+'</li>\\n' +
            '                                                                    <li style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \\helvetica neue\\, helvetica, sans-serif;line-height:21px;Margin-bottom:15px;margin-left:0;color:#333333;font-size:14px;text-align:left">Account Name: ' + data.data.account_name+'</li>\\n' +
            '                                                                </ol></td>\\n' +
            '                                                        </tr>\\n' +
            '                                                    </table></td>\\n' +
            '                                            </tr>\\n' +
            '                                        </table></td>\\n' +
            '                                </tr>\\n' +
            '                            </table></td>\\n' +
            '                    </tr>\\n' +
            '                </table>\\n' +
            '                <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">\\n' +
            '                    <tr>\\n' +
            '                        <td class="es-info-area" align="center" style="padding:0;Margin:0">\\n' +
            '                            <table class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" bgcolor="#FFFFFF">\\n' +
            '                                <tr>\\n' +
            '                                    <td align="left" style="padding:20px;Margin:0">\\n' +
            '                                        <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">\\n' +
            '                                            <tr>\\n' +
            '                                                <td align="center" valign="top" style="padding:0;Margin:0;width:560px">\\n' +
            '                                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">\\n' +
            '                                                        <tr>\\n' +
            '                                                            <td align="center" class="es-infoblock" style="padding:0;Margin:0;line-height:14px;font-size:12px;color:#CCCCCC"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \\helvetica neue\\, helvetica, sans-serif;line-height:14px;color:#CCCCCC;font-size:12px"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px"></a>No longer want to receive these emails?&nbsp;<a href="" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px">Unsubscribe</a>.<a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px"></a></p></td>\\n' +
            '                                                        </tr>\\n' +
            '                                                    </table></td>\\n' +
            '                                            </tr>\\n' +
            '                                        </table></td>\\n' +
            '                                </tr>\\n' +
            '                            </table></td>\\n' +
            '                    </tr>\\n' +
            '                </table></td>\\n' +
            '        </tr>\\n' +
            '    </table>\\n' +
            '</div>\\n' +
            '</body>\\n'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });


    })

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
        'webhook_url': 'https://app.savebills.com.ng/api/auth/run'
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
