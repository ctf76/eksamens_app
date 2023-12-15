import fs  from 'fs';
import csvParser from 'csv-parser';
import User from "../models/user.js";


const importUserData = async () => {
    const usersCsv = './db_data/user_table.csv';

    return new Promise((resolve, reject) => {
        const users = [];

        fs.createReadStream(usersCsv)
            .pipe(csvParser())
            .on('data', (row) => {
                users.push(row);
            })
            .on('end', async () => {
                try {
                    await User.bulkCreate(users);
                    console.log(users.length + ' records inserted successfully into users table.');
                    resolve();
                } catch (error) {
                    console.error('Error during bulkCreate:', error);
                    reject(error);
                }
            })
            .on('error', (error) => {
                console.error('Error reading CSV file:', error);
                reject(error);
            });
    });
};

export default importUserData