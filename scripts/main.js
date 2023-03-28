//Global variable pointing to the current user's Firestore document
var currentUser;

//Function that calls everything needed for the main page  
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            console.log(currentUser);

            // the following functions are always called when someone is logged in
            insertNameFromFirestore();
            displayCardsDynamically("stops");
        } else {
            // No user is signed in.
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}
doAll();

//-----------------------------------------------------------------------------
// This function is called whenever the user clicks on the "bookmark" icon.
// It adds the stop to the "bookmarks" array
// Then it will change the bookmark icon from the hollow to the solid version. 
//-----------------------------------------------------------------------------
function saveBookmark(stopDocID) {
    currentUser.set({
        bookmarks: firebase.firestore.FieldValue.arrayUnion(stopDocID)
    }, {
        merge: true
    })
        .then(function () {
            console.log("bookmark has been saved for: " + currentUser);
            var iconID = 'save-' + stopDocID;
            //console.log(iconID);
            //this is to change the icon of the stop that was saved to "filled"
            document.getElementById(iconID).innerText = 'bookmark';
        });
}   

// Insert name function using the global variable "currentUser"
function insertNameFromFirestore() {
    currentUser.get().then(userDoc => {
        //get the user name
        var user_Name = userDoc.data().name;
        console.log(user_Name);
        $("#name-goes-here").text(user_Name); //jquery
        // document.getElementByID("name-goes-here").innetText=user_Name;
    })
}
// Comment out the next line (we will call this function from doAll())
// insertNameFromFirestore();

function writeStops() {
    //define a variable for the collection you want to create in Firestore to populate data
    var stopsRef = db.collection("stops");

    stopsRef.add({
        code: "R4",
        name: "R4 UBC", 
        city: "Vancouver",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    stopsRef.add({
        code: "2",
        name: "2 Downtown - Burrard Station", 
        city: "Vancouver",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    stopsRef.add({
        code: "3",
        name: "3 Downtown - Waterfront Station", 
        city: "Vancouver",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    stopsRef.add({
        code: "4",
        name: "4 UBC", 
        city: "Vancouver",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    stopsRef.add({
        code: "5",
        name: "5 Downtown - Cambie at Dunsmuir", 
        city: "Vancouver",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    stopsRef.add({
        code: "130",
        name: "130 Metrotown Station", 
        city: "Burnaby",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    stopsRef.add({
        code: "134",
        name: "134 Brentwood Station", 
        city: "Burnaby",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    stopsRef.add({
        code: "209",
        name: "209 Burrard Station", 
        city: "Vancouver",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    stopsRef.add({
        code: "210",
        name: "210 Burrard Station", 
        city: "Vancouver",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    stopsRef.add({
        code: "212",
        name: "212 Phibbs Exchange", 
        city: "North Vancouver",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    stopsRef.add({
        code: "222",
        name: "222 Metrotown Station", 
        city: "Burnaby",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    stopsRef.add({
        code: "227",
        name: "227 Phibbs Exchange", 
        city: "North Vancouver",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    stopsRef.add({
        code: "228",
        name: "228 Lonsdale Quay", 
        city: "North Vancouver",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    stopsRef.add({
        code: "229",
        name: "229 Lonsdale Quay", 
        city: "North Vancouver",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    stopsRef.add({
        code: "232",
        name: "232 Grouse Mountain", 
        city: "North Vancouver",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    stopsRef.add({
        code: "240",
        name: "240 Downtown - Cambie at Georgia", 
        city: "Vancouver",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
}

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("stopCardTemplate");

    db.collection(collection) //the collection called "stops"
        .orderBy("last_updated")
        // .limit(2)
        .get()
        .then(allStops => {
            //var i = 1;  //Optional: if you want to have a unique ID for each stop
            allStops.forEach(doc => { //iterate thru each doc
                var title = doc.data().name; // get value of the "name" key
                var stopCode = doc.data().code; //get unique ID to each stop to be used for fetching right image
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true);

                //update title and text and image etc.
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('a').href = "eachStop.html?docID=" + docID;

                //NEW LINE: update to display length, duration, last updated
                newcard.querySelector('.card-length').innerHTML =
                    "Last updated: " + doc.data().last_updated.toDate().toLocaleDateString();

                //NEW LINES: next 2 lines are new for demo#11
                //this line sets the id attribute for the <i> tag in the format of "save-hikdID" 
                //so later we know which stop to bookmark based on which stop was clicked
                newcard.querySelector('i').id = 'save-' + docID;
                // this line will call a function to save the stops to the user's document             
                newcard.querySelector('i').onclick = () => saveBookmark(docID);

                currentUser.get().then(userDoc => {
                    //get the user name
                    var bookmarks = userDoc.data().bookmarks;
                    if (bookmarks.includes(docID)) {
                        document.getElementById('save-' + docID).innerText = 'bookmark';
                    }
                })

                //Finally done modifying newcard
                //attach to gallery, Example: "stops-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayCardsDynamically("stops");  //input param is the name of the collection
