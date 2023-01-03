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
const purchase = require("../controllers/purchase.controller");
const run = require("../controllers/run.controller");
const run1 = require("../controllers/run1.controller");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

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

  app.post("/api/auth/signin", controller.signin);
  app.get("/api/auth/dashboard",
      [authJwt.verifyToken],

      dashboard.dashboard);
  app.post("/api/auth/airtime", airtime.airtime);
  app.post("/api/auth/buydata", buydata.buydata);
  app.post("/api/auth/tv", tv.tv);
  app.post("/api/auth/verifytv", verifytv.verifytv);
  app.post("/api/auth/verifyelect", verifyelect.verifyelect);
  app.post("/api/auth/buytv", buytv.buytv);
  app.post("/api/auth/buyelect", buyelect.buyelect);
  app.post("/api/auth/profile", profile.profile);
  app.post("/api/auth/run", run.run);
  app.post("/api/auth/run1", run1.run1);

      app.post("/api/auth/data", data.data);
      app.post("/api/auth/createlock", createlock.safelock);
      app.get("/api/auth/allock",
          [authJwt.verifyToken],
          alllock.allock);
 app.get("/api/auth/purchase",
          [authJwt.verifyToken],
          purchase.purchase);
 app.get("/api/auth/alldeposit",
          [authJwt.verifyToken],
          alldeposit.alldeposit);

  app.post("/api/auth/signout", controller.signout);
};
