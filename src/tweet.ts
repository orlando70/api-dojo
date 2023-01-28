import TwitterApi from "twitter-api-v2";
import axios from "axios";


export const tweet = async () => {
    
    const client = new TwitterApi({
        appKey: `${process.env.CONSUMER_KEY}`,
        appSecret: `${process.env.CONSUMER_SECRET}`,
        accessToken: `${process.env.ACCESS_TOKEN}`,
        accessSecret: `${process.env.ACCESS_SECRET}`
    });

    const prompt = `Hello, AI! `

    const config = {
        prompt,
        temperature: 0.7,
        max_tokens: 600,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        model: 'text-davinci-003',
        stream: false
    }

    const res = await axios.post("https://api.openai.com/v1/completions", config, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPEN_AI_KEY ?? ""}`,
        },
    })

    console.log(res.data.choices[0].text);
    
    
    // await client.v2.tweetThread([
    //     'Hello, lets talk about Twitter!',
    //     'This thread is automatically made with twitter-api-v2 :D',
    //   ]);    

}