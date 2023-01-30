import admin from "firebase-admin";
import firebaseConfigJson from "../.firebase/firebaseConfig";
import { getDatabase } from 'firebase-admin/database';
import { ITopic } from "./utility";



const firebaseConfig = JSON.parse(JSON.stringify(firebaseConfigJson));

console.log(firebaseConfigJson);


const app = admin.initializeApp({
    credential: admin.credential.cert({
        ...firebaseConfig,
        privateKey: firebaseConfig.private_key.replace(/\\n/g, '\n'),
    }),
    databaseURL: "https://api-dojo-default-rtdb.firebaseio.com",
});

const db = getDatabase(app);

export default class DojoDB {
    private ref = db.ref("api-dojo/topics");
    private topicsRef = this.ref.push();

    async createTopic(data: string | ITopic) {

       await this.topicsRef.set({
            data
        })
        console.log("data written... ", data);
        
    }

    async readAllTopics () {
        const results: string[] = [];

        await this.ref.once("value", (snapshot: any) => {
            snapshot.forEach((data: any) => {
                results.push(data.val())
            })
        })

        return results;
    }

}
