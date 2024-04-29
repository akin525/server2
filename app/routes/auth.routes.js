const { verifySignUp, authJwt} = require("../middleware");
const controller = require("../controllers/auth.controller");
const dashboard = require("../controllers/dashboard.controller");
const airtime = require("../controllers/airtime.controller");
const data = require("../controllers/data.controller");
const buydata = require("../controllers/buydata.controller");
const tv = require("../controllers/tv.controller");
const verifytv = require("../controllers/verifytv.controller");
const verifyelect = require("../controllers/verifyelect.controller");
const buytv = require("../controllers/buytv.controller");
const buyelect = require("../controllers/buyelect.controller");
const profile = require("../controllers/profile.controller");
const createlock = require("../controllers/safelock.controller");
const alllock = require("../controllers/lock.controller");
const alldeposit = require("../controllers/deposit.controller");
const addlock = require("../controllers/addlock.controller");
const purchase = require("../controllers/purchase.controller");
const run = require("../controllers/run.controller");
const run1 = require("../controllers/run1.controller");
const interest = require("../controllers/interest.controller");
const bank = require("../controllers/bank.controller");
const verify = require("../controllers/verify.controller");
const withdraw = require("../controllers/withdraw.controller");
const update = require("../controllers/date.controller");
const pass = require("../controllers/pass.controller");
const fund = require("../controllers/fund.controller");
const upgrade = require("../controllers/upgrade.controller");
const changepassword = require("../controllers/changpass.controller");
const listdata= require("../controllers/listdata.controller");
const googl = require("../controllers/google.controller");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const paylony=require("../controllers/paylony.controller");
const Pin=require("../controllers/pin.controller");
const verifyemail=require("../controllers/verifyemail.controller");
const Fingerprint=require("../controllers/finger.controller");
const Resend =require("../controllers/getotp.controller");
const verifybe=require("../controllers/verifybetting.controller");
const buybet=require("../controllers/buybetting.controller");
const account2=require("../controllers/generateaccountall.controller");
const account3=require("../controllers/generateaccountall1.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );
    app.get("/api/auth/newaccount", account2.generateAccountall);
    app.get("/api/auth/newacc", account3.generateAccountall);
    app.post("/api/auth/newacc1", account3.generateaccountone);
    app.post("/api/auth/newaccount1", account2.generateaccountone);
  app.post("/api/auth/verifybetting", verifybe.verifybetting);
  app.post("/api/auth/buybet", buybet.bet);
  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/verifyemail", verifyemail.verifyemail);
  app.get("/api/auth/dashboard",
      [authJwt.verifyToken],

      dashboard.dashboard);
    app.get("/api/auth/fingerprint",
        [authJwt.verifyToken],

        Fingerprint.finger);
  app.post("/api/auth/otp", Resend.otp);
  app.post("/api/auth/createpin", Pin.createpin);
  app.post("/api/auth/changepin", Pin.changepin);
  app.get("/listdata", listdata.listdata);
  app.post("/api/auth/airtime", airtime.airtime);
  app.post("/api/auth/buydata", buydata.buydata);
  app.post("/api/auth/buydatanew", buydata.buydatanew);
  app.post("/api/auth/buydatageneral", buydata.buydatgeneral);
  app.post("/api/auth/tv", tv.tv);
  app.post("/api/auth/verifytv", verifytv.verifytv);
  app.post("/api/auth/verifyelect", verifyelect.verifyelect);
  app.post("/api/auth/buytv", buytv.buytv);
  app.post("/api/auth/buyelect", buyelect.buyelect);
  app.post("/api/auth/profile", profile.profile);
  app.post("/api/auth/run", run.run);
  app.post("/api/auth/run1", run1.run1);
  app.post("/api/auth/paylony", paylony.paylony);
  app.post("/api/auth/addlock", addlock.add);
  app.get("/api/auth/in", interest.add);
  app.get("/api/auth/update", update.add);
  app.get("/api/auth/bank", bank.bank);
  app.post("/api/auth/verify", verify.bank);
  app.post("/api/auth/cpass", changepassword.cpass);
  app.post("/api/auth/pass", pass.password);
  app.post("/api/auth/fund", fund.fund);
  app.post("/api/auth/verifyfund", fund.fundverify);
  app.post("/api/auth/verifytest", fund.fundverifytest);
  app.post("/api/auth/upgrade", upgrade.upgrade);
  app.post("/api/auth/google", googl.google);

      app.post("/api/auth/data", data.data);
      app.post("/api/auth/datanew", data.datanew);
      app.post("/api/auth/createlock", createlock.safelock);
      app.get("/api/auth/allock",
          [authJwt.verifyToken],
          alllock.allock);
 app.get("/api/auth/purchase",
          [authJwt.verifyToken],
          purchase.purchase);
 app.post("/api/auth/with",
         withdraw.bank);
 app.get("/api/auth/alldeposit",
          [authJwt.verifyToken],
          alldeposit.alldeposit);

  app.post("/api/auth/signout", controller.signout);
  app.post("/api/auth/delete", controller.delete);
};
