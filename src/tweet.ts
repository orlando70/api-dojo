import TwitterApi from "twitter-api-v2";
import axios from "axios";
import { example1, example2 } from "./examples"
import fs from "fs";
import DojoDB from "./firebase";



export const tweet = async () => {

    const client = new TwitterApi({
        appKey: `${process.env.CONSUMER_KEY}`,
        appSecret: `${process.env.CONSUMER_SECRET}`,
        accessToken: `${process.env.ACCESS_TOKEN}`,
        accessSecret: `${process.env.ACCESS_SECRET}`
    });

    const db = new DojoDB();

    // let topics = await fs.promises.readFile('topics.txt', 'utf8') || [];
    const topics = db.readAllTopics();
    // const topics = ["rate-limiting", "api security", "api versioning", "API Caching and Performance Tuning", "Error handling", "api documentation"]
   

    const prompt = `Generate one random advanced topic on api design. 
    both topic and sub-topics should not be related to any of ${topics}.
    divide it into as many as 5 sub topics and explain them as simple as possible for a beginner 
    software engineer to easily understand. give an example for explanations when necessary
    use this json format {
        "topic": "Thread 🧵👇: + string",
        "sub-topics": {
            "sub-topic": explanation<string>,
        },
        "CTA": string
    }
    result should not be more than 1500 characters and there should be conclusion with a call-to-action (CTA) to follow @api_dojo.`
    const config = {
        prompt,
        temperature: 0.7,
        max_tokens: 1500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        model: 'text-davinci-003',
    }

    const res = await axios.post("https://api.openai.com/v1/completions", config, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPEN_AI_KEY ?? ""}`,
        },
    })

    const result = res.data.choices[0].text.trim()

    fs.writeFileSync('result.json', result);

    let data = await fs.promises.readFile('result.json', 'utf8');
    let jsonData = JSON.parse(data);

    await db.createTopic(jsonData);
    // fs.promises.appendFile('topics.txt', '\n' + jsonData.topic);
    

    // await client.v2.tweetThread([
    //     jsonData.topic,
    //     jsonData["sub-topics"][0]
    // ]);

}