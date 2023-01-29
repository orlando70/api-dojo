import TwitterApi from "twitter-api-v2";
import axios from "axios";
import fs from "fs";
import DojoDB from "./firebase";
import path from "path";


type IData = {
    topic: string | ITopic,
    subTopics: {
        [key: string]: string
    },
    cta: string
}

export interface ITopic {
    text: string;
    media: {
        media_ids: string[];
    };
}


interface IOptions {
    apiKey: string;
}


export default class Utils extends DojoDB {

    private apiKey
    private appKey: string = `${process.env.CONSUMER_KEY}`
    private appSecret: string = `${process.env.CONSUMER_SECRET}`
    private accessToken: string = `${process.env.ACCESS_TOKEN}`
    private accessSecret: string = `${process.env.ACCESS_SECRET}`

    constructor(options: IOptions) {
        super();
        this.apiKey = options.apiKey;
    }

    private async initTweets() {
        return new TwitterApi({
            appKey: this.appKey,
            appSecret: this.appSecret,
            accessToken: this.accessToken,
            accessSecret: this.accessSecret
        });
    }

    async processAndPostTweet() {
        const dbTopics = await this.readAllTopics();

        const topics: string[] = []
        dbTopics.map((topic) => {
            const topicsObj = JSON.parse(JSON.stringify(topic));
            topics.push(topicsObj.data)
        });

        const broadTopics = ["api's", "programming concepts", "operating systems", "database engineering", "software engineering interview questions"]
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
        result should not be more than 1500 characters and there should be conclusion with a call-to-action (CTA) to follow @api_dojo.`


        const res = await axios.post("https://api.openai.com/v1/completions", {
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
                Authorization: `Bearer ${this.apiKey ?? ""}`,
            },
        })

        const result = res.data.choices[0].text.trim();

        const generatedTweet = await this.processGeneratedTweet(result);

        const formattedTweet = await this.formatGeneratedTweet(generatedTweet);

        await this.postTweet(formattedTweet);
    }

    private async processGeneratedTweet(payload: string) {
        await fs.promises.writeFile('result.json', payload);

        let data = await fs.promises.readFile('result.json', 'utf8');
        let jsonData: IData = JSON.parse(data);
        await this.createTopic(jsonData.topic);
        return jsonData;
    }

    async formatGeneratedTweet(jsonData: IData): Promise<(string | object)[]> {
        let { topic, subTopics, cta } = jsonData;

        const client = await this.initTweets();
        const mediaId = await client.v1.uploadMedia('./image.jpeg');

        const topicWithImage = { text: topic, media: { media_ids: [mediaId] } }

        const tweets: (string | object)[] = [];

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

    async postTweet(tweets: (string|object)[]) {
        const client = await this.initTweets();
        await client.v2.tweetThread(tweets)
    }

    private async generateImage(prompt: string) {
        const image = await axios.post("https://api.openai.com/v1/images/generations", {
            prompt,
            n: 1,
            size: "512x512"
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey ?? ""}`,
            },
        });
        return image.data.data[0].url;
    }

    async downloadImage(prompt: string) {
        const url = await this.generateImage(prompt);
        const filename = 'image.jpg';

        const image = await axios.get(url, {
            responseType: "stream"
        });
        image.data.pipe(fs.createWriteStream(filename));
    }
}