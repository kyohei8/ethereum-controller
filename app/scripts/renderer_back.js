var config = {
  apiKey: "AIzaSyDD_m0iOSbZiYHj2mWr16bqegquNvPcBaI",
  authDomain: "fractia-9c9af.firebaseapp.com",
  databaseURL: "https://fractia-9c9af.firebaseio.com",
  storageBucket: "fractia-9c9af.appspot.com",
  messagingSenderId: "175590345760"
};

firebase.initializeApp(config);

/*
var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/plus.login');
provider.setCustomParameters({
  'login_hint': 'user@example.com'
});

firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // ...
}).catch(function(error) {
  // Handle Errors here.
  console.log(error);
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});

*/

// var userId = firebase.auth().currentUser.uid;
// console.log(userId);

const db = firebase.database();

const ref = db.ref('projects').limitToLast(10);
console.log(ref);

ref.on('value', function(d){
  console.log(d.val()[0]);
}, function(e){
  console.log(e);
});


// const t = ref.orderByChild("project_id").equalTo(0);
// console.log(t.ref());
