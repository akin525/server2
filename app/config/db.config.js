module.exports = {
  HOST: "localhost",
  USER: "saveaugf_app",
  PASSWORD: "@Savebills2022",
  DB: "saveaugf_app",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
// module.exports = {
//   HOST: "localhost",
//   USER: "root",
//   PASSWORD: "",
//   DB: "savebills",
//   dialect: "mysql",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   }
// };

