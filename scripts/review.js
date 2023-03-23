var hikeDocID = localStorage.getItem("hikeDocID");
console.log(hikeDocID);

function getHikeName(id) {
  db.collection("hikes")
    .doc(id)
    .get()
    .then((thisHike) => {
      var hikeName = thisHike.data().name;
      document.getElementById("hikeName").innerHTML = hikeName;
    });
}

getHikeName(hikeDocID);

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

function writeReview() {
  console.log("inside write review");
  let Title = document.getElementById("title").value;
  // let Level = document.getElementById("level").value;
  // let Season = document.getElementById("season").value;
  let Description = document.getElementById("description").value;
  // let Flooded = document.querySelector('input[name="flooded"]:checked').value;
  // let Scrambled = document.querySelector('input[name="scrambled"]:checked').value;
  // console.log(Title, Level, Season, Description, Flooded, Scrambled);

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid);
      var userID = user.uid;
      //get the document for current user.
      currentUser.get().then((userDoc) => {
        var userEmail = userDoc.data().email;

        // Create a storage reference
        var storageRef = firebase.storage().ref();

        // Create a child reference
        var imagesRef = storageRef.child("images");

        // Create a reference to the image file
        var imageRef = imagesRef.child(imageFile.name);

        // Upload the file to the storage reference
        imageRef.put(imageFile).then(() => {
          // Once the image is uploaded, get the download URL
          imageRef.getDownloadURL().then((url) => {
            // Add the review data to the Firestore database
            db.collection("reviews")
              .add({
                hikeDocID: hikeDocID,
                userID: userID,
                // title: Title,
                image: url,
                // level: Level,
                // season: Season,
                description: Description,
                // flooded: Flooded,
                // scrambled: Scrambled,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              })
              .then(() => {
                window.location.href = "thanks.html"; //new line added
              });
          });
        });
      });
    } else {
      console.log("No user is signed in");
      window.location.href = "review.html";
    }
  });
}
