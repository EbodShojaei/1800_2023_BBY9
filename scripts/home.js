firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    populateStops(user);
  }
});

function populateStops(user) {
  db.collection("users").doc(user.uid).get()
    .then(userDoc => {
      let stopCardTemplate = document.getElementById("savedCardTemplate");
      let stopCardGroup = document.getElementById("savedCardGroup");

      let params = new URL(window.location.href) //get the url from the search bar
      let stopID = params.searchParams.get("docID");
      var bookmarks = userDoc.data().bookmarks;

      bookmarks.forEach(stopID => {
        db.collection("stops").doc(stopID).get().then((stopDoc) => {
          var stopName = stopDoc.data().name;
          db.collection("stops").doc(stopID).collection("updates").orderBy("timestamp", "desc").limit(1).get()
            .then((allUpdates) => {
              updates = allUpdates.docs.sort((a, b) =>
                // sort the updates in descending order based on timestamp
                b.data().timestamp.toDate() - a.data().timestamp.toDate()
              );
              console.log(updates);
              updates.forEach((doc) => {
                var description = doc.data().description;
                var image = doc.data().image;
                var time = doc.data().timestamp.toDate();
                console.log(time);
      
                let updateCard = savedCardTemplate.content.cloneNode(true);
                updateCard.querySelector('.title').innerHTML = stopName;
                updateCard.querySelector('.time').innerHTML = new Date(time).toLocaleString();
                updateCard.querySelector('.image').src = image;
                updateCard.querySelector('.description').innerHTML = `Description: ${description}`;

                // Prepend adds each card as the first child.
                savedCardGroup.prepend(updateCard);
              })
            })
        });
      });
    });
}
