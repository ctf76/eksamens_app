import fs from 'fs';
import csvParser from 'csv-parser';
import FriendShip from '../models/friendship.js';

const importFriendshipData = async () => {
    const friendsCsv = './db_data/friends_table.csv';

    return new Promise((resolve, reject) => {
        const friends = [];

        fs.createReadStream(friendsCsv)
            .pipe(csvParser())
            .on('data', (row) => {
                friends.push(row);
            })
            .on('end', async () => {
                try {
                    await FriendShip.bulkCreate(friends);
                    console.log(friends.length + ' records inserted successfully into friendship table.');
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

export default importFriendshipData
