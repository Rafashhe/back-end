var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://abimael-1afcb-default-rtdb.firebaseio.com",
});

module.exports = admin;
