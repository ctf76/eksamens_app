import sequelize from "./db_conn.js";

export const tablesHaveData = async () => {
    try {
        // Use Sequelize's query method to check if the tables have data
        const [userData, postData] = await Promise.all([
            sequelize.query("SELECT COUNT(*) as count FROM users"),
            sequelize.query("SELECT COUNT(*) as count FROM posts"),
            sequelize.query("SELECT COUNT(*) as count FROM friendships")
        ]);

        // Check if the counts are greater than zero
        const usersHaveData = userData[0][0].count > 0;
        const postsHaveData = postData[0][0].count > 0;

        // Return true only if both tables have data
        return usersHaveData && postsHaveData;
    } catch (error) {
        console.error("Error checking table data: ", error);
        return false;
    }
};

export default tablesHaveData