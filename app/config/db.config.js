module.exports = {
  HOST: "localhost",      // IP address or domain name of the MySQL server
  USER: "savebill_app",      // MySQL username
  PASSWORD: "@Savebills2022", // MySQL password
  DB: "savebill_app",        // MySQL database name
  dialect: "mysql",          // MySQL dialect
  pool: {                    // Connection pool configuration
    max: 5,                  // Maximum number of connections in the pool
    min: 0,                  // Minimum number of connections in the pool
    acquire: 30000,          // Maximum time (in milliseconds) that a connection can be idle before being released
    idle: 10000              // Maximum time (in milliseconds) that a connection can remain idle in the pool before being released
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

