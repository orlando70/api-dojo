"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const firebaseConfig_1 = __importDefault(require("../firebaseConfig"));
const database_1 = require("firebase-admin/database");
const firebaseConfig = JSON.parse(JSON.stringify(firebaseConfig_1.default));
console.log("firebaseConfigJson, ", process.env.FIREBASE_CLIENT_EMAIL);
const app = firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(Object.assign(Object.assign({}, firebaseConfig), { privateKey: firebaseConfig.private_key.replace(/\\n/g, '\n') })),
    databaseURL: "https://api-dojo-default-rtdb.firebaseio.com",
});
const db = (0, database_1.getDatabase)(app);
class DojoDB {
    constructor() {
        this.ref = db.ref("api-dojo/topics");
        this.topicsRef = this.ref.push();
    }
    async createTopic(data) {
        await this.topicsRef.set({
            data
        });
        console.log("data written... ", data);
    }
    async readAllTopics() {
        const results = [];
        await this.ref.once("value", (snapshot) => {
            snapshot.forEach((data) => {
                results.push(data.val());
            });
        });
        return results;
    }
}
exports.default = DojoDB;
