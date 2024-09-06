const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const refer = db.refer;
const Role = db.role;
var request = require('request');
const Op = db.Sequelize.Op;
// const pin=require("../controllers/otp.controller");
const otp=db.otp;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const {validationResult} = require("express-validator");

exports.signup = async (req, res, next) => {
  // Save User to Database
  const decryptedData = req.decryptedData;
  
  try {

    const user = await User.create({
      name:decryptedData.name,
      username: decryptedData.username,
      email: decryptedData.email,
      password: bcrypt.hashSync(decryptedData.password, 8),
    });

    if (decryptedData.refer !==null) {
      const reffer = await refer.create({
        username:decryptedData.username,
        newuserid:decryptedData.refer,
      });
    }
    if (decryptedData.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: decryptedData.roles,
          },
        },
      });



      const pin= Math.floor(1000 + Math.random() * 9000);

      const insertotp= await otp.create({
        username:decryptedData.username,
        pin:pin,
      });

      const result = user.setRoles(roles);
      // if (result) res.send({ status: 1, message: "User registered successfully!" });
    } else {
      // user has role = 1
      const result = user.setRoles([1]);
      // if (result) res.send({ status: 1, message: "User registered successfully!" });
    }
    // var options = {
    //   'method': 'POST',
    //   'url': 'https://integration.mcd.5starcompany.com.ng/api/reseller/virtual-account2',
    //   'headers': {
    //     'Authorization': 'mcd_key_yhij3dui0678iujk23hegwtfyu23dwky'
    //   },
    //   formData: {
    //     'account_name': decryptedData.name,
    //     'business_short_name': 'SAVEBILLS',
    //     'uniqueid': decryptedData.username+Math.floor((Math.random() * 10000) + 1),
    //     'email': decryptedData.email,
    //     'phone': decryptedData.phone,
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
    //   User.findAll({ where: { username: decryptedData.username}}).then((result) => {
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

    // var option = {
    //   'method': 'POST',
    //   'url': 'https://api.paylony.com/api/v1/create_account',
    //   'headers': {
    //     'Authorization': 'Bearer sk_live_av30amcd3piinbfm48j0v8iv8sd5hm81rhqikjz',
    //   },
    //   formData: {
    //     "firstname":decryptedData.username,
    //     "lastname":decryptedData.name,
    //     "address":"onibudo akute ogun state",
    //     "gender":"Male",
    //     "email":decryptedData.email,
    //     "phone":"07036219209",
    //     "dob":"1989-12-11",
    //     "provider":"safehaven"
    //   }
    // };
    // request(option, function (error, response) {
    //   if (error) throw new Error(error);
    //   console.log(response.body);
    //
    //
    //   var data=JSON.parse(response.body);
    //   console.log(response.body);
    //   console.log(data);
    //   const objectToUpdate = {
    //     account_number: data.data.account_number,
    //     account_name: data.data.account_name,
    //     bank1: data.data.provider,
    //   };
    //
    //   User.findAll({ where: { username: decryptedData.username}}).then((result) => {
    //     if(result){
    //       result[0].set(objectToUpdate);
    //       result[0].save();
    //     }
    //   })
    //
    //   var transporter = nodemailer.createTransport({
    //     host: 'savebills.com.ng',
    //     port: 465,
    //     secure: true, // use SSL
    //     auth: {
    //       user: 'info@savebills.com.ng',
    //       pass: 'W3lc0m32Z3f@'
    //     }
    //   });
    //
    //   var mailOptions = {
    //     from: 'info@savebills.com.ng',
    //     to:'info@savebills.com.ng,'+ decryptedData.email,
    //     subject: 'New User',
    //     html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="font-family:arial, \'helvetica neue\', helvetica, sans-serif"><head><meta charset="UTF-8"><meta content="width=device-width, initial-scale=1" name="viewport"><meta name="x-apple-disable-message-reformatting"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta content="telephone=no" name="format-detection"><title>New message</title><!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><!--[if !mso]><!-- --><link href="https://fonts.googleapis.com/css2?family=Imprima&display=swap" rel="stylesheet"><!--<![endif]--><style type="text/css">#outlook a {\tpadding:0;}.es-button {\tmso-style-priority:100!important;\ttext-decoration:none!important;}a[x-apple-data-detectors] {\tcolor:inherit!important;\ttext-decoration:none!important;\tfont-size:inherit!important;\tfont-family:inherit!important;\tfont-weight:inherit!important;\tline-height:inherit!important;}.es-desk-hidden {\tdisplay:none;\tfloat:left;\toverflow:hidden;\twidth:0;\tmax-height:0;\tline-height:0;\tmso-hide:all;}[data-ogsb] .es-button {\tborder-width:0!important;\tpadding:15px 20px 15px 20px!important;}@media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:30px!important; text-align:left } h2 { font-size:24px!important; text-align:left } h3 { font-size:20px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important; text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important; text-align:left } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button, button.es-button { font-size:18px!important; display:block!important; border-right-width:0px!important; border-left-width:0px!important; border-top-width:15px!important; border-bottom-width:15px!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0!important } .es-m-p0r { padding-right:0!important } .es-m-p0l { padding-left:0!important } .es-m-p0t { padding-top:0!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } .es-m-p5 { padding:5px!important } .es-m-p5t { padding-top:5px!important } .es-m-p5b { padding-bottom:5px!important } .es-m-p5r { padding-right:5px!important } .es-m-p5l { padding-left:5px!important } .es-m-p10 { padding:10px!important } .es-m-p10t { padding-top:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p10r { padding-right:10px!important } .es-m-p10l { padding-left:10px!important } .es-m-p15 { padding:15px!important } .es-m-p15t { padding-top:15px!important } .es-m-p15b { padding-bottom:15px!important } .es-m-p15r { padding-right:15px!important } .es-m-p15l { padding-left:15px!important } .es-m-p20 { padding:20px!important } .es-m-p20t { padding-top:20px!important } .es-m-p20r { padding-right:20px!important } .es-m-p20l { padding-left:20px!important } .es-m-p25 { padding:25px!important } .es-m-p25t { padding-top:25px!important } .es-m-p25b { padding-bottom:25px!important } .es-m-p25r { padding-right:25px!important } .es-m-p25l { padding-left:25px!important } .es-m-p30 { padding:30px!important } .es-m-p30t { padding-top:30px!important } .es-m-p30b { padding-bottom:30px!important } .es-m-p30r { padding-right:30px!important } .es-m-p30l { padding-left:30px!important } .es-m-p35 { padding:35px!important } .es-m-p35t { padding-top:35px!important } .es-m-p35b { padding-bottom:35px!important } .es-m-p35r { padding-right:35px!important } .es-m-p35l { padding-left:35px!important } .es-m-p40 { padding:40px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } .es-m-p40r { padding-right:40px!important } .es-m-p40l { padding-left:40px!important } }</style></head>\n' +
    //         '<body style="width:100%;font-family:arial, \'helvetica neue\', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"><div class="es-wrapper-color" style="background-color:#FFFFFF"><!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#ffffff"></v:fill> </v:background><![endif]--><table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FFFFFF"><tr><td valign="top" style="padding:0;Margin:0"><table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"><tr><td align="center" style="padding:0;Margin:0"><table bgcolor="#efefef" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#EFEFEF;border-radius:20px 20px 0 0;width:600px"><tr><td align="left" style="padding:0;Margin:0;padding-top:40px;padding-left:40px;padding-right:40px"><table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" valign="top" style="padding:0;Margin:0;width:520px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://savebills.com.ng" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#2D3142;font-size:18px"><img src="https://zdhohi.stripocdn.email/content/guids/CABINET_aa116c34329819457e623e57039fa3037bfb5d688cbc335994717c7960135024/images/lg.png" alt="Loren Lynch Marketing Manager at Company" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border-radius:100px" width="100" title="Loren Lynch Marketing Manager at Company" class="adapt-img" height="95"></a></td>\n' +
    //         '</tr></table></td></tr></table></td>\n' +
    //         '</tr><tr><td style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;background-color:#6fa8dc" align="left" bgcolor="#6fa8dc"><!--[if mso]><table dir="rtl" style="width:560px" cellpadding="0" cellspacing="0"><tr><td dir="ltr" style="width:225px" valign="top"><![endif]--><table cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:225px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" style="padding:10px;Margin:0"><h1 class="b_title" style="Margin:0;line-height:72px;mso-line-height-rule:exactly;font-family:Imprima, Arial, sans-serif;font-size:48px;font-style:normal;font-weight:bold;color:#ffffff">Thanks for Register with us</h1>\n' +
    //         '</td></tr><tr><td align="center" style="padding:0;Margin:0;padding-top:10px"><p class="b_description" style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Imprima, Arial, sans-serif;line-height:18px;color:#ffffff;font-size:12px">Enjoy our low price Dataplan With Extral Bundle</p></td></tr></table></td></tr></table><!--[if mso]></td><td dir="ltr" style="width:20px"></td>\n' +
    //         '<td dir="ltr" style="width:315px" valign="top"><![endif]--><table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"><tr><td class="es-m-p0r" valign="top" align="center" style="padding:0;Margin:0;width:315px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://zdhohi.stripocdn.email/content/guids/CABINET_aa116c34329819457e623e57039fa3037bfb5d688cbc335994717c7960135024/images/whatsapp_image_20230114_at_113759_pm.jpeg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="315" height="313"></td></tr></table></td></tr></table><!--[if mso]></td>\n' +
    //         '</tr></table><![endif]--></td></tr></table></td>\n' +
    //         '</tr></table><table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"><tr><td align="center" style="padding:0;Margin:0"><table bgcolor="#efefef" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#EFEFEF;width:600px"><tr><td align="left" style="Margin:0;padding-top:20px;padding-bottom:40px;padding-left:40px;padding-right:40px"><table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" valign="top" style="padding:0;Margin:0;width:520px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="left" style="padding:0;Margin:0"><ul><li style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Imprima, Arial, sans-serif;line-height:27px;Margin-bottom:15px;margin-left:0;color:#2D3142;font-size:18px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Imprima, Arial, sans-serif;line-height:27px;color:#2D3142;font-size:18px">Name: '+decryptedData.name+'</p>\n' +
    //         '</li><li style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Imprima, Arial, sans-serif;line-height:27px;Margin-bottom:15px;margin-left:0;color:#2D3142;font-size:18px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Imprima, Arial, sans-serif;line-height:27px;color:#2D3142;font-size:18px">Username: ' + decryptedData.username+'</p></li><li style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Imprima, Arial, sans-serif;line-height:27px;Margin-bottom:15px;margin-left:0;color:#2D3142;font-size:18px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Imprima, Arial, sans-serif;line-height:27px;color:#2D3142;font-size:18px">Number: ' + decryptedData.phone+'</p></li>\n' +
    //         '<li style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Imprima, Arial, sans-serif;line-height:27px;Margin-bottom:15px;margin-left:0;color:#2D3142;font-size:18px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Imprima, Arial, sans-serif;line-height:27px;color:#2D3142;font-size:18px">Password: ' + decryptedData.password+'</p></li><li style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Imprima, Arial, sans-serif;line-height:27px;Margin-bottom:15px;margin-left:0;color:#2D3142;font-size:18px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Imprima, Arial, sans-serif;line-height:27px;color:#2D3142;font-size:18px">Wallet: ₦0</p></li>\n' +
    //         '<li style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Imprima, Arial, sans-serif;line-height:27px;Margin-bottom:15px;margin-left:0;color:#2D3142;font-size:18px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Imprima, Arial, sans-serif;line-height:27px;color:#2D3142;font-size:18px">Email:' + decryptedData.email+'</p></li></ul></td></tr></table></td></tr></table></td></tr></table></td>\n' +
    //         '</tr></table><table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"><tr><td align="center" style="padding:0;Margin:0"><table bgcolor="#efefef" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#EFEFEF;border-radius:0 0 20px 20px;width:600px"><tr><td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:40px;padding-right:40px"><!--[if mso]><table style="width:520px" cellpadding="0" cellspacing="0"><tr><td style="width:70px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" align="left" class="es-left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"><tr><td class="es-m-p20b" align="center" valign="top" style="padding:0;Margin:0;width:70px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" class="es-m-txt-l" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#2D3142;font-size:18px"><img src="https://zdhohi.stripocdn.email/content/guids/CABINET_055ba03e85e991c70304fecd78a2dceaf6b3f0bc1b0eb49336463d3599679494/images/group.png" alt="Demo" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="70" title="Demo" height="70"></a></td>\n' +
    //         '</tr></table></td></tr></table><!--[if mso]></td><td style="width:20px"></td><td style="width:430px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right"><tr><td align="center" valign="top" style="padding:0;Margin:0;width:430px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="left" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Imprima, Arial, sans-serif;line-height:24px;color:#2D3142;font-size:16px">You can contact our support using mail: info@savebills.com.ng</p></td></tr></table></td></tr></table><!--[if mso]></td></tr></table><![endif]--></td></tr></table></td>\n' +
    //         '</tr></table></td></tr></table></div></body></html>\n'
    //   };
    //
    //   transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   });
    //
    //
    //
    //   var transporter1 = nodemailer.createTransport({
    //     host: 'savebills.com.ng',
    //     port: 465,
    //     secure: true, // use SSL
    //     auth: {
    //       user: 'info@savebills.com.ng',
    //       pass: 'W3lc0m32Z3f@'
    //     }
    //   });
    //
    //   var mailOptions1 = {
    //     from: 'info@savebills.com.ng',
    //     to:'info@savebills.com.ng,'+ decryptedData.email,
    //     subject:decryptedData.username+'OTP',
    //     html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en"><head><meta charset="UTF-8"><meta content="width=device-width, initial-scale=1" name="viewport"><meta name="x-apple-disable-message-reformatting"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta content="telephone=no" name="format-detection"><title>New message 4</title> <!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]--> <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> <!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml>\n' +
    //         '<![endif]--> <!--[if !mso]><!-- --><link href="https://fonts.googleapis.com/css?family=Merriweather:400,400i,700,700i" rel="stylesheet"><link href="https://fonts.googleapis.com/css?family=Merriweather+Sans:400,400i,700,700i" rel="stylesheet"> <!--<![endif]--><style type="text/css">#outlook a { padding:0;}.es-button { mso-style-priority:100!important; text-decoration:none!important;}a[x-apple-data-detectors] { color:inherit!important; text-decoration:none!important; font-size:inherit!important; font-family:inherit!important; font-weight:inherit!important; line-height:inherit!important;}.es-desk-hidden { display:none; float:left; overflow:hidden; width:0; max-height:0; line-height:0; mso-hide:all;} @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120%!important } h1 { font-size:36px!important; text-align:left }\n' +
    //         ' h2 { font-size:26px!important; text-align:left } h3 { font-size:20px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:36px!important; text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px!important; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important; text-align:left } .es-menu td a { font-size:12px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important }\n' +
    //         ' *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:20px!important; display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0!important } .es-m-p0r { padding-right:0!important }\n' +
    //         ' .es-m-p0l { padding-left:0!important } .es-m-p0t { padding-top:0!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-m-p5 { padding:5px!important } .es-m-p5t { padding-top:5px!important } .es-m-p5b { padding-bottom:5px!important } .es-m-p5r { padding-right:5px!important }\n' +
    //         ' .es-m-p5l { padding-left:5px!important } .es-m-p10 { padding:10px!important } .es-m-p10t { padding-top:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p10r { padding-right:10px!important } .es-m-p10l { padding-left:10px!important } .es-m-p15 { padding:15px!important } .es-m-p15t { padding-top:15px!important } .es-m-p15b { padding-bottom:15px!important } .es-m-p15r { padding-right:15px!important } .es-m-p15l { padding-left:15px!important } .es-m-p20 { padding:20px!important } .es-m-p20t { padding-top:20px!important } .es-m-p20r { padding-right:20px!important } .es-m-p20l { padding-left:20px!important } .es-m-p25 { padding:25px!important } .es-m-p25t { padding-top:25px!important } .es-m-p25b { padding-bottom:25px!important } .es-m-p25r { padding-right:25px!important } .es-m-p25l { padding-left:25px!important } .es-m-p30 { padding:30px!important } .es-m-p30t { padding-top:30px!important }\n' +
    //         ' .es-m-p30b { padding-bottom:30px!important } .es-m-p30r { padding-right:30px!important } .es-m-p30l { padding-left:30px!important } .es-m-p35 { padding:35px!important } .es-m-p35t { padding-top:35px!important } .es-m-p35b { padding-bottom:35px!important } .es-m-p35r { padding-right:35px!important } .es-m-p35l { padding-left:35px!important } .es-m-p40 { padding:40px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } .es-m-p40r { padding-right:40px!important } .es-m-p40l { padding-left:40px!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } }@media screen and (max-width:384px) {.mail-message-content { width:414px!important } }</style>\n' +
    //         ' </head> <body style="width:100%;font-family:arial, \'helvetica neue\', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"><div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#FAFAFA"> <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#fafafa"></v:fill> </v:background><![endif]--><table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA"><tr>\n' +
    //         '<td valign="top" style="padding:0;Margin:0"><table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"><tr><td align="center" style="padding:0;Margin:0"><table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"><tr><td align="left" style="padding:0;Margin:0;padding-top:15px;padding-left:20px;padding-right:20px"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>\n' +
    //         '<td align="center" valign="top" style="padding:0;Margin:0;width:560px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0px"><img src="https://lgftzw.stripocdn.email/content/guids/CABINET_d21f70b2694739708cd4f72a6c5e2dff1bd3568cbb19c482c389a4615c92c137/images/lgded7938f7b7bdd344a7a.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="100" height="95"></td> </tr><tr>\n' +
    //         '<td align="center" class="es-m-p0r es-m-p0l es-m-txt-c" style="Margin:0;padding-top:15px;padding-bottom:15px;padding-left:40px;padding-right:40px"><h1 style="Margin:0;line-height:55px;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;font-size:46px;font-style:normal;font-weight:bold;color:#333333">OTP<br></h1></td></tr><tr><td align="center" style="padding:0;Margin:0;padding-top:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">Kindly use this Otp generated to verify your email:</p><em><u><strong><span style="font-size:21px;font-family:\'merriweather sans\', \'helvetica neue\', helvetica, arial, sans-serif">' + pin+'</span></strong></u></em></td></tr></table></td></tr></table></td></tr> <tr>\n' +
    //         '<td align="left" style="padding:0;Margin:0;padding-bottom:20px;padding-left:20px;padding-right:20px"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" valign="top" style="padding:0;Margin:0;width:560px"><table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-radius:5px" role="none"><tr><td align="center" style="padding:0;Margin:0;display:none"></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></div></body></html>'
    //   };
    //
    //   transporter1.sendMail(mailOptions1, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   });
    //
    //
    //
    //
    // });
    return  res.send({ status: 1, message: "User registered successfully!" });

  } catch (error) {
    res.status(500).send({status: 1, message: error.message });
  }
};

// exports.signin = async (req, res) => {
//
//   const decryptedData = req.decryptedData;
//   try {
//     if (decryptedData.username===""){
//       return res.status(200).send({
//         status: "0",
//         message: "Enter your username!"
//       });
//     }
//     if (decryptedData.password===""){
//       return res.status(200).send({
//         status: "0",
//         message: "Enter your password!"
//       });
//     }
//     const user = await User.findOne({
//       where: {
//         username: decryptedData.username,
//       },
//     });
//
//     if (!user) {
//       return res.status(200).send({status: "0", message: "User Not found." });
//     }
//
//     const passwordIsValid = bcrypt.compareSync(
//         decryptedData.password,
//         user.password
//     );
//
//     if (!passwordIsValid) {
//       return res.status(200).send({
//         status: "0",
//         message: "Invalid Password!",
//       });
//     }
//
//     const token = jwt.sign({ id: user.id }, config.secret, {
//       expiresIn: 86400, // 24 hours
//     });
//
//     let authorities = [];
//     const roles = await user.getRoles();
//     for (let i = 0; i < roles.length; i++) {
//       authorities.push("ROLE_" + roles[i].name.toUpperCase());
//     }
//
//     // req.session.token = token;
//
//     return res.status(200).send({
//       status:1,
//       message:"login successful",
//       data:{id: user.id,
//         name: user.name,
//         username: user.username,
//         email: user.email,
//         roles: authorities,
//         token: token,
//         pin:user.pin
//       }
//
//     });
//   } catch (error) {
//     return res.status(200).send({ message: error.message });
//   }
// };
exports.signin = async (req, res) => {

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        status: 0,
        message: 'Errors',
        errors: errors.array()
      });
    }
    if (req.body.username===""){
      return res.status(200).send({
        status: "0",
        message: "Enter your username!"
      });
    }
    if (req.body.password===""){
      return res.status(200).send({
        status: "0",
        message: "Enter your password!"
      });
    }
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
      status:1,
      message:"login successful",
      data:{id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        roles: user.role,
        token: token,
        pin:user.pin
      }

    });
  } catch (error) {
    return res.status(200).send({ message: error.message });
  }
};
exports.delete = async (req, res) => {
  // const { username, password } = req.query;
  // if (!username || !password) {
  //   return res.status(400).json({ status:0, error: 'Both username and password are required' });
  // }
  const decryptedData = req.decryptedData;

  const userId = decryptedData.email;

  try {
    if (decryptedData.email===""){
      return res.status(200).send({
        status: "0",
        message: "email required"
      });
    }

    // const existingUser = await User.findByPk(userId);
    // if (!existingUser) {
    //   return res.status(404).json({status:0, message: 'User not found' });
    // }

    // Delete the user
    await User.destroy({
      where: {
        email: userId,
      },
    });

    res.json({status:1, message: 'User deleted successfully' });
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

