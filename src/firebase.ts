import admin from "firebase-admin";
import firebaseConfigJson from "../firebaseConfig";
import { getDatabase } from 'firebase-admin/database';



const firebaseConfig = JSON.parse(JSON.stringify(firebaseConfigJson));

const app = admin.initializeApp({
    credential: admin.credential.cert({
        ...firebaseConfig,
        privateKey: firebaseConfig.private_key.replace(/\\n/g, '\n'),
    }),
    databaseURL: "https://api-dojo-default-rtdb.firebaseio.com",
});

const db = getDatabase(app);

export default class DojoDB {
    private ref = db.ref("api-dojo");
    private topicsRef = this.ref.child("/topics");

    async createTopic(data: string) {

       await this.topicsRef.set({
            topics: data
        })
    }

    async readAllTopics () {
        const result: string[] = [];

        await this.topicsRef.once("value", (snapshot: any) => {
            snapshot.forEach((data: any) => {
                result.push(data.val())
            })
        })
    }

}
