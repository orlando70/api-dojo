import Utils from "./utility"


export const tweet = async () => {

    const util = new Utils({
        apiKey: `${process.env.OPEN_AI_KEY}`
    });

    await util.processAndPostTweet();
}