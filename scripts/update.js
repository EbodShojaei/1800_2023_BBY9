var stopDocID = localStorage.getItem("stopDocID");

console.log(stopDocID);

function getStopName(id) {
  db.collection("stops")
    .doc(id)
    .get()
    .then((thisStop) => {
      var stopName = thisStop.data().name;
      document.getElementById("stopName").innerHTML = stopName;
    });
}

getStopName(stopDocID);

// event listener for selecting file to upload. (tech tip b01)
// var imageFile;

// listen for file selection
var fileInput = document.getElementById("mypic-input"); // pointer #1
const image = document.getElementById("mypic-goes-here"); // pointer #2

// When a change happens to the File Chooser Input
fileInput.addEventListener("change", function (e) {
  imageFile = e.target.files[0]; //Global variable
  var imageURL = URL.createObjectURL(imageFile);
  image.src = imageURL; // Display this image
});

function postUpdate() {
  console.log("inside post update");
  let Description = document.getElementById("description").value;

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid);
      var userID = user.uid;
      currentUser.get().then((userDoc) => {
        var userEmail = userDoc.data().email;

        // Create a storage reference
        var storageRef = firebase.storage().ref();

        // Create reference to stored images
        var imagesRef = storageRef.child("images");

        // Create a reference to the image file
        var imageRef = imagesRef.child(imageFile.name);

        // Upload the file to the storage reference
        imageRef.put(imageFile).then(() => {

          // Once the image is uploaded, get the download URL
          imageRef.getDownloadURL().then((url) => {
            // Retrieve the "stopDocID" document from the "stops" collection
            db.collection("stops").doc(stopDocID).collection("updates")
              .add({
                stopDocID: stopDocID,
                userID: userID,
                image: url,
                description: Description,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              })
              .then((updateRef) => {
                // Update the "last_updated" attribute in the "stops" collection
                db.collection("stops").doc(stopDocID).update({
                  last_updated: firebase.firestore.FieldValue.serverTimestamp()
                });
                // Add the update ID to the user's "updates" array
                currentUser.update({
                  updates: firebase.firestore.FieldValue.arrayUnion(updateRef.id)
                }).then(() => {
                  window.location.href = "thanks.html";
                });
              });
          });
        });
      });
    } else {
      console.log("No user is signed in");
      window.location.href = "update.html";
    }
  });
}
