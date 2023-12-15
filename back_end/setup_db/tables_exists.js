import sequelize from "./db_conn.js";

export const tablesExist = async () => {
    try {
        // Use Sequelize's query method to check if the tables exist. Should be checking for all tables
        const result = await sequelize.query("SHOW TABLES LIKE 'users'");

        // If the table 'users' exists, return true; otherwise, return false
        return result[0].length > 0;
    } catch (error) {
        console.error("Error checking table existence: ", error);
        return false;
    }
};

export default tablesExist