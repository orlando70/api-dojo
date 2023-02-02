"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const tweet_1 = require("./tweet");
const node_cron_1 = __importDefault(require("node-cron"));
dotenv_1.default.config({ path: process.env.ENV_FILE_PATH });
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const task = node_cron_1.default.schedule(
//run by 12:00(noon) daily
`0 */12 * * *`, async () => {
    try {
        (0, tweet_1.tweet)();
    }
    catch (error) {
        let retry = 0;
        while (retry < 10) {
            setTimeout(() => {
                (0, tweet_1.tweet)();
            }, 5000);
            retry += 1;
        }
        throw new Error(error);
    }
});
// task.start();
(0, tweet_1.tweet)();
app.use("/healthz", (_, res) => {
    res.status(200).send({ status: "OK" });
});
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}...`);
});
