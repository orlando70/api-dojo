"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tweet = void 0;
const utility_1 = __importDefault(require("./utility"));
const tweet = async () => {
    const util = new utility_1.default({
        apiKey: `${process.env.OPEN_AI_KEY}`
    });
    // await util.processAndPostTweet();
    console.log("hI");
};
exports.tweet = tweet;
