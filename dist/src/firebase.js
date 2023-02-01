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
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const firebaseConfig_1 = __importDefault(require("../.firebase/firebaseConfig"));
const database_1 = require("firebase-admin/database");
const firebaseConfig = JSON.parse(JSON.stringify(firebaseConfig_1.default));
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
    createTopic(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.topicsRef.set({
                data
            });
            console.log("data written... ", data);
        });
    }
    readAllTopics() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            yield this.ref.once("value", (snapshot) => {
                snapshot.forEach((data) => {
                    results.push(data.val());
                });
            });
            return results;
        });
    }
}
exports.default = DojoDB;
