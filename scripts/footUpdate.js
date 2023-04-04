// Update function for the bottom navbar.
Description = "";
emptyIMG = '//:0'
document.querySelector("#uploadPost").addEventListener("click", function (e) {
  document.querySelector(".mypic-goes-here-foot").src = emptyIMG;
  document.getElementById("description-foot").value = Description;
});

// listen for file selection
var fileInput = document.querySelector(".mypic-input-foot"); // pointer #1
const dropdownImage = document.querySelector(".mypic-goes-here-foot"); // pointer #2

// When a change happens to the File Chooser Input
fileInput.addEventListener("change", function (e) {
  imageFile = e.target.files[0]; //Global variable
  var imageURL = URL.createObjectURL(imageFile);
  dropdownImage.src = imageURL; // Display this image
});

function postDropdownUpdate() {
    console.log("inside post update");
    let Description = document.getElementById("description-foot").value;
  
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
  
          var stopName = document.querySelector('#searchbtn').innerHTML;
  
          // Query the Firestore collection to get the document that matches the name attribute
          db.collection("stops").where("name", "==", stopName)
            .get()
            .then((querySnapshot) => {
              // Get the document ID of the matching document
              var selectedID = querySnapshot.docs[0].id;
  
              // Upload the file to the storage reference
              imageRef.put(imageFile).then(() => {
  
                // Once the image is uploaded, get the download URL
                imageRef.getDownloadURL().then((url) => {
                  // Retrieve the "stopDocID" document from the "stops" collection
                  db.collection("stops").doc(selectedID).collection("updates")
                    .add({
                      stopDocID: selectedID,
                      userID: userID,
                      image: url,
                      description: Description,
                      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    })
                    .then((updateRef) => {
                      // Update the "last_updated" attribute in the "stops" collection
                      db.collection("stops").doc(selectedID).update({
                        last_updated: firebase.firestore.FieldValue.serverTimestamp()
                      });
                      // Add the update ID to the user's "updates" array
                      currentUser.update({
                        updates: firebase.firestore.FieldValue.arrayUnion(updateRef.id)
                      }).then(() => {
                        swal("Success", "Post uploaded!", "success");
                        document.querySelector("#uploadPost").click();
                      });
                    });
                });
              });
            })
            .catch((error) => {
              console.log("Error getting document:", error);
            });
        });
      } else {
        console.log("No user is signed in");
        swal({
          title: "Please sign in",
          text: "Sign in to upload a new post",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
      }
    });
  }
  