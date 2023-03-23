firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      populateReviews(user);
    }
  });
  
  function populateReviews(user) {
    db.collection("users").doc(user.uid).get()
      .then(userDoc => {
        let hikeCardTemplate = document.getElementById("savedCardTemplate");
        let hikeCardGroup = document.getElementById("savedCardGroup");
  
        let params = new URL(window.location.href) //get the url from the searbar
        let hikeID = params.searchParams.get("docID");
        var bookmarks = userDoc.data().bookmarks;
  
        bookmarks.forEach(hikeID => {
          db.collection("reviews").where("hikeDocID", "==", hikeID).orderBy("timestamp", "desc").limit(1).get()
            .then(allReviews => {
              reviews = allReviews.docs;
              console.log(reviews);
              reviews.forEach(doc => {
                var description = doc.data().description; //gets the length field
                var image = doc.data().image;
                var time = doc.data().timestamp.toDate();
                console.log(time)
  
                let reviewCard = hikeCardTemplate.content.cloneNode(true);
                reviewCard.querySelector('.time').innerHTML = new Date(time).toLocaleString();
                reviewCard.querySelector('.image').src = image;
                reviewCard.querySelector('.description').innerHTML = `Description: ${description}`;
                hikeCardGroup.appendChild(reviewCard);
              })
            })
        });
      });
  }
  

// firebase.auth().onAuthStateChanged((user) => {
//     if (user) {
//       populateReviews(user);
//     }
//   });
  
//   function populateReviews(user) {
//     db.collection("users").doc(user.uid).get()
//         .then(userDoc => {
//             let hikeCardTemplate = document.getElementById("savedCardTemplate");
//             let hikeCardGroup = document.getElementById("savedCardGroup");
  
//             let params = new URL(window.location.href) //get the url from the searbar
//             let hikeID = params.searchParams.get("docID");
//             var bookmarks = userDoc.data().bookmarks;
  
//             bookmarks.forEach(hikeID => {
//                 db.collection("reviews").where("hikeDocID", "==", hikeID).get()
//                     .then(allReviews => {
//                         reviews = allReviews.docs;
//                         console.log(reviews);
//                         reviews.forEach(doc => {
//                             var description = doc.data().description; //gets the length field
//                             var image = doc.data().image;
//                             var time = doc.data().timestamp.toDate();
//                             console.log(time)
  
//                             let reviewCard = hikeCardTemplate.content.cloneNode(true);
//                             reviewCard.querySelector('.time').innerHTML = new Date(time).toLocaleString();
//                             reviewCard.querySelector('.image').src = image;
//                             reviewCard.querySelector('.description').innerHTML = `Description: ${description}`;
//                             hikeCardGroup.appendChild(reviewCard);
//                         })
//                     })
//             });
//         });
//   }
  