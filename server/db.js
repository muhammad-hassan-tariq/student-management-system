const sql = require("mssql/msnodesqlv8");

const config = {
    server: "DESKTOP-D86LV5L\\SQLEXPRESS",
    database: "StudentManagementDB",
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

const poolPromise = sql.connect(config)
    .then(pool => {
        console.log("Connected to SQL Server");
        return pool;
    })
    .catch(error => {
        console.error("Database connection failed:", error);
    });

module.exports = {
    sql,
    poolPromise
};