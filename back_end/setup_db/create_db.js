// Script for creating tables and importing testdata into db
import importUserData  from "./import_user_data.js";
import importPostData  from "./import_post_data.js";
import importFriendshipData from "./import_friendship_data.js";
import importReactionData from "./import_reaction_data.js"
import tablesExist  from "./tables_exists.js";
import tablesHaveData  from "./tables_have_data.js";

// Setting up tables in database

async function createDatabase(sequelizeInstance, { force_reset = false }) {
    try {
        const tE = await tablesExist();
        const tHD = await tablesHaveData();

        if (!tE || !tHD || force_reset) {
            // Tables exist but don't have data or forcing recreation, so sync the database and import data
            await sequelizeInstance.sync({ force: true });
            // Data was downloaded from Kaggle
            await importUserData();
            await importPostData();
            await importFriendshipData();
            await importReactionData();
            console.log('Tables created and records inserted successfully.');
        } else {
            console.log('Tables already exist and have data. Skipping setup.');
        }
        return sequelizeInstance;
    } catch (error) {
        console.error("Encountered an error: ", error);
    }
}

export default createDatabase