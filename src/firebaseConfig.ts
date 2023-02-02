import env from "dotenv";

env.config({ path: process.env.ENV_FILE_PATH })


export default {
  type: "service_account",
  project_id: "api-dojo",
  private_key_id: "40c7b0fe5cef3ccfe37d419c2392d94fd14ece21",
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-jw3dk%40api-dojo.iam.gserviceaccount.com"
}
