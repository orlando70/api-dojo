"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twitter_api_v2_1 = __importDefault(require("twitter-api-v2"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const firebase_1 = __importDefault(require("./firebase"));
class Utils extends firebase_1.default {
    constructor(options) {
        super();
        this.appKey = `${process.env.CONSUMER_KEY}`;
        this.appSecret = `${process.env.CONSUMER_SECRET}`;
        this.accessToken = `${process.env.ACCESS_TOKEN}`;
        this.accessSecret = `${process.env.ACCESS_SECRET}`;
        this.apiKey = options.apiKey;
    }
    initTweets() {
        return __awaiter(this, void 0, void 0, function* () {
            return new twitter_api_v2_1.default({
                appKey: this.appKey,
                appSecret: this.appSecret,
                accessToken: this.accessToken,
                accessSecret: this.accessSecret
            });
        });
    }
    processAndPostTweet() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const dbTopics = yield this.readAllTopics();
            const topics = [];
            dbTopics.map((topic) => {
                const topicsObj = JSON.parse(JSON.stringify(topic));
                topics.push(topicsObj.data);
            });
            const broadTopics = ["api's", "programming concepts", "operating systems", "database engineering", "software engineering interview questions"];
            const prompt = `Generate one random advanced topic on ${broadTopics} 
        topic and sub-topics should be very different to any of ${topics}.
        divide it into as many as 5 sub topics and explain them as simple as possible for a beginner 
        software engineer to easily understand. give an example for explanations when necessary
        use this json format {
            "topic": "Thread 🧵👇: + string",
            "subTopics": {
                "subTopic": explanation<string>,
            },
            "cta": string
        }
        result should not be more than 1500 characters and there should be conclusion with a call-to-action (CTA) to follow @api_dojo.`;
            const res = yield axios_1.default.post("https://api.openai.com/v1/completions", {
                prompt,
                temperature: 0.7,
                max_tokens: 1500,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                model: 'text-davinci-003',
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${(_a = this.apiKey) !== null && _a !== void 0 ? _a : ""}`,
                },
            });
            const result = res.data.choices[0].text.trim();
            const generatedTweet = yield this.processGeneratedTweet(result);
            const formattedTweet = yield this.formatGeneratedTweet(generatedTweet);
            yield this.postTweet(formattedTweet);
        });
    }
    processGeneratedTweet(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs_1.default.promises.writeFile('result.json', payload);
            let data = yield fs_1.default.promises.readFile('result.json', 'utf8');
            let jsonData = JSON.parse(data);
            yield this.createTopic(jsonData.topic);
            return jsonData;
        });
    }
    formatGeneratedTweet(jsonData) {
        return __awaiter(this, void 0, void 0, function* () {
            let { topic, subTopics, cta } = jsonData;
            const client = yield this.initTweets();
            const mediaId = yield client.v1.uploadMedia('./image.jpeg');
            const topicWithImage = { text: topic, media: { media_ids: [mediaId] } };
            const tweets = [];
            for (const [key, value] of Object.entries(subTopics)) {
                let tweet = `${key.toUpperCase()}: `;
                const words = value.split(" ");
                for (const word of words) {
                    if (tweet.length + word.length + 1 > 140) {
                        tweets.push(tweet);
                        tweet = "";
                    }
                    tweet += `${word} `;
                }
                tweets.push(tweet);
            }
            // Add the topic as the first tweet and the CTA as the last tweet
            tweets.unshift(topicWithImage);
            tweets.push(cta);
            return tweets;
        });
    }
    postTweet(tweets) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.initTweets();
            yield client.v2.tweetThread(tweets);
        });
    }
    generateImage(prompt) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield axios_1.default.post("https://api.openai.com/v1/images/generations", {
                prompt,
                n: 1,
                size: "512x512"
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${(_a = this.apiKey) !== null && _a !== void 0 ? _a : ""}`,
                },
            });
            return image.data.data[0].url;
        });
    }
    downloadImage(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = yield this.generateImage(prompt);
            const filename = 'image.jpg';
            const image = yield axios_1.default.get(url, {
                responseType: "stream"
            });
            image.data.pipe(fs_1.default.createWriteStream(filename));
        });
    }
}
exports.default = Utils;
