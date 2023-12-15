import fs from 'fs';
import csvParser from 'csv-parser';
import { DataTypes } from "sequelize";
import sequelize from "./db_conn.js";
import Post from "../models/post.js"

export const importPostData = async () => {
    const postsCsv = './db_data/posts_table.csv';

    return new Promise((resolve, reject) => {
        const posts = [];

        fs.createReadStream(postsCsv)
            .pipe(csvParser())
            .on('data', (row) => {
                posts.push(row);
            })
            .on('end', async () => {
                try {
                    await Post.bulkCreate(posts);
                    console.log(posts.length + ' records inserted successfully into posts table.');
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

export default importPostData