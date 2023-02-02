"use strict";
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
    async initTweets() {
        return new twitter_api_v2_1.default({
            appKey: this.appKey,
            appSecret: this.appSecret,
            accessToken: this.accessToken,
            accessSecret: this.accessSecret
        });
    }
    async processAndPostTweet() {
        var _a;
        const dbTopics = await this.readAllTopics();
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
        const res = await axios_1.default.post("https://api.openai.com/v1/completions", {
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
        const generatedTweet = await this.processGeneratedTweet(result);
        const formattedTweet = await this.formatGeneratedTweet(generatedTweet);
        await this.postTweet(formattedTweet);
    }
    async processGeneratedTweet(payload) {
        await fs_1.default.promises.writeFile('result.json', payload);
        let data = await fs_1.default.promises.readFile('result.json', 'utf8');
        let jsonData = JSON.parse(data);
        await this.createTopic(jsonData.topic);
        return jsonData;
    }
    async formatGeneratedTweet(jsonData) {
        let { topic, subTopics, cta } = jsonData;
        const client = await this.initTweets();
        const mediaId = await client.v1.uploadMedia('./image.jpeg');
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
    }
    async postTweet(tweets) {
        const client = await this.initTweets();
        await client.v2.tweetThread(tweets);
    }
    async generateImage(prompt) {
        var _a;
        const image = await axios_1.default.post("https://api.openai.com/v1/images/generations", {
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
    }
    async downloadImage(prompt) {
        const url = await this.generateImage(prompt);
        const filename = 'image.jpg';
        const image = await axios_1.default.get(url, {
            responseType: "stream"
        });
        image.data.pipe(fs_1.default.createWriteStream(filename));
    }
}
exports.default = Utils;
