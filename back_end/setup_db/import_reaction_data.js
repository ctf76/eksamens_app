import fs from 'fs';
import csvParser from 'csv-parser';
import Reaction from '../models/reaction.js';

const importReactionData = async () => {
    const reactionCsv = './db_data/reactions_table_adj.csv';

    return new Promise((resolve, reject) => {
        const reactions = [];

        fs.createReadStream(reactionCsv)
            .pipe(csvParser())
            .on('data', (row) => {
                reactions.push(row);
            })
            .on('end', async () => {
                try {
                    await Reaction.bulkCreate(reactions);
                    console.log(reactions.length + ' records inserted successfully into reactions table.');
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

export default importReactionData
