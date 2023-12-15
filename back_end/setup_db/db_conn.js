import Sequelize from "sequelize";
import "dotenv/config.js";
import mysql from "mysql2/promise";

// Connect to MySQL
const mysqlConnection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
});

try {
    await mysqlConnection.connect();
    console.log("Connected to MySQL successfully");

    // Create database if it doesn't exist
    const databaseName = process.env.MYSQL_DATABASE;
    const createDbquery = "CREATE DATABASE IF NOT EXISTS " + databaseName;
    await mysqlConnection.query(createDbquery);
    console.log("Database created successfully");
} catch (err) {
    console.log("Uh oh - something went wrong: ", err);
} finally {
    // Close connection
    await mysqlConnection.end();
}

// Initialize Sequelize
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: "localhost",
    dialect: "mysql",
});

try {
    await sequelize.authenticate();
    console.log("Connection to the database has been established successfully.");
} catch (error) {
    console.error("Unable to connect to the database:", error);
}

// Export database connection
export default sequelize;