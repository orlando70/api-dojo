import express from "express";
import env from "dotenv";
import { tweet } from "./tweet";

env.config({path: process.env.ENV_FILE_PATH})

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

tweet();

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}...`);   
})