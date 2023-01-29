import express from "express";
import env from "dotenv";
import { tweet } from "./tweet";
import cron from "node-cron";

env.config({ path: process.env.ENV_FILE_PATH })

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const task = cron.schedule(
    `0 12 */2 * *`,
    async () => {
        try {
            tweet();
        } catch (error: any) {
            let retry = 0;
            while (retry < 10) {
                setTimeout(() => {
                    tweet();
                }, 5000)
                retry += 1;
            }
            throw new Error(error)
        }
    });

    task.start();

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}...`);
})