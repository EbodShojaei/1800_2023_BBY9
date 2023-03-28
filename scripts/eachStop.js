//Global variable pointing to the current user's Firestore document
var currentUser;

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid); //global
        console.log(currentUser);
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.href = "login.html";
    }
});

function displayStopInformation() {
    //retreive the document id from the url
    let params = new URL(window.location.href) //get the url from the search bar
    let stopID = params.searchParams.get("docID");
    console.log(stopID);

    db.collection("stops").doc(stopID).get().then(thisStop => {
        stopInfo = thisStop.data();
        stopCode = stopInfo.code;
        stopName = stopInfo.name;

        document.getElementById("stopName").innerHTML = stopName;
    }

    )

}
displayStopInformation();

function saveStopDocumentIDAndRedirect() {
    let params = new URL(window.location.href) //get the url from the search bar
    let stopID = params.searchParams.get("docID");
    localStorage.setItem('stopDocID', stopID);
    window.location.href = 'update.html';
}

function populateUpdates() {
    let updateCardTemplate = document.getElementById("updateCardTemplate");
    let updateCardGroup = document.getElementById("updateCardGroup");

    let params = new URL(window.location.href) //get the url from the search bar
    let stopID = params.searchParams.get("docID");

    // doublecheck: is your collection called "Updates" or "updates"?
    db.collection("stops").doc(stopID).collection("updates").where("stopDocID", "==", stopID).orderBy("timestamp", "desc").get()
        .then(allUpdates => {
            updates = allUpdates.docs;
            console.log(updates);
            updates.forEach(doc => {
                var description = doc.data().description;
                var image = doc.data().image;
                var time = doc.data().timestamp.toDate();
                console.log(time)

                let updateCard = updateCardTemplate.content.cloneNode(true);
                updateCard.querySelector('.time').innerHTML = new Date(time).toLocaleString();
                updateCard.querySelector('.image').src = image;
                updateCard.querySelector('.description').innerHTML = `Description: ${description}`;
                updateCardGroup.appendChild(updateCard);
            })
        })
}
populateUpdates();

let params = new URL(window.location.href) //get the url from the search bar
let stopID = params.searchParams.get("docID");

function saveBookmark(stopID) {
    currentUser.set({
        bookmarks: firebase.firestore.FieldValue.arrayUnion(stopID)
    }, {
        merge: true
    })
        .then(function () {
            console.log("bookmark has been saved for: " + currentUser);
            var iconID = 'save-' + stopID;
            //console.log(iconID);
            //this is to change the icon of the stop that was saved to "filled"
            document.getElementById(iconID).innerText = 'bookmark';
        });
}

//NEW LINES: next 2 lines are new for demo#11
//this line sets the id attribute for the <i> tag in the format of "save-hikeID" 
//so later we know which stop to bookmark based on which stop was clicked
document.querySelector('.bookmarkStop').querySelector('i').id = 'save-' + stopID;
// this line will call a function to save the stops to the user's document             
document.querySelector('.bookmarkStop').querySelector('i').onclick = () => saveBookmark(stopID);

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid); //global
        console.log(currentUser);
        currentUser.get().then(userDoc => {
            //get the user name
            var bookmarks = userDoc.data().bookmarks;
            if (bookmarks.includes(stopID)) {
                document.getElementById('save-' + stopID).innerText = 'bookmark';
            }
        })
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.href = "login.html";
    }
});
