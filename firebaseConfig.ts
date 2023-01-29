// const firebaseConfig = {
//     apiKey: "AIzaSyCWoANT4oADbXWSQcT3LYr29l8cof_WbAA",
//     authDomain: "api-dojo.firebaseapp.com",
//     databaseURL: "https://api-dojo-default-rtdb.firebaseio.com",
//     projectId: "api-dojo",
//     storageBucket: "api-dojo.appspot.com",
//     messagingSenderId: "422478875002",
//     appId: "1:422478875002:web:115f6bc0d3ccbea426eec3",
//     measurementId: "G-Y7WLNC5XD6"
//   };

  export default{
    "type": "service_account",
    "project_id": "api-dojo",
    "private_key_id": process.env.FIREBASE_PRIVATE_KEYID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY,
    "client_email": "firebase-adminsdk-jw3dk@api-dojo.iam.gserviceaccount.com",
    "client_id": "101578404487453525551",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-jw3dk%40api-dojo.iam.gserviceaccount.com"
  }
  