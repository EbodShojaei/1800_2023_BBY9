//Global variable pointing to the current user's Firestore document
var currentUser;

//Function that calls everything needed for the main page
function doAll() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid); //global
      console.log(currentUser);

      // the following functions are always called when someone is logged in
      
      listenForBookmarkedHikeChanges();
    } else {
      // No user is signed in.
      console.log("No user is signed in");
      window.location.href = "login.html";
    }
  });
}
doAll();

// Listener function for update alerts (Tech tip #25)
function listenForBookmarkedHikeChanges() {
    currentUser.get().then((userDoc) => {
      let bookmarks = userDoc.data().bookmarks; // step2
  
      if (bookmarks) {
        bookmarks.forEach((stopId) => {
          let hikeRef = db.collection("stops").doc(stopId).collection("updates");
          let lastUpdateTimestamp = false // null;
  
          db.collection("stops")
            .doc(stopId)
            .get()
            .then((hikeDoc) => {
              // step5
              let hikeName = hikeDoc.data().name;
  
              hikeRef
                .orderBy("timestamp", "desc")
                .limit(1)
                .onSnapshot((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    let updateData = doc.data();
                    let updateTimestamp = updateData.timestamp;
  
                    if ((((Date.now() / 1000) - updateTimestamp.seconds) < 2) ) {
                      swal("New Update!", `See status in "${hikeName}"`, "info");
                      // alert(`New update for stop "${hikeName}" added!`);
                      lastUpdateTimestamp = true; //updateTimestamp;
                      console.log(updateTimestamp.seconds);
                      console.log(Date.now()/1000);
                      return;
                    }
                  });
                });
            });
        });
      }
    });
  }
  