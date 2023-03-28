/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function toggleSearch() {
  document.getElementById("searchDropdown").classList.toggle("show");
}

// fetch the collection of stops and store it in a variable called 'stops'
const stopsRef = firebase.firestore().collection('stops');
const stops = [];

stopsRef.get().then((aStop) => {
  aStop.forEach((doc) => {
    stops.push({ id: doc.id, name: doc.data().name });
  });
});

// search input button
const searchInput = document.querySelector('.input')

// Listen for key inputs and match with stop names from Firebase.
searchInput.addEventListener("input", (e) => {
  let value = e.target.value

  if (value && value.trim().length > 0) {
    value = value.trim().toLowerCase();
    const filteredStops = stops.filter(stop => stop.name.trim().toLowerCase().includes(value));

    //returning only the results of setList if the value of the search is included in the bus name
    setList(filteredStops.filter(bus => {
      return bus.name.toLowerCase().includes(value)
    }))
  } else {
    clearList();
  }
})

// Remove the results from the page
function clearList() {
  list.innerHTML = ''
}

// function that returns 'no results' dialog to user for searches with no matches.
function noResults() {
  // element for the error; a list item ("li")
  const error = document.createElement('li')
  // add class name to error message
  error.classList.add('error-message')
  // create text to append to error element
  const text = document.createTextNode('No results found')
  // append the text to error element
  error.appendChild(text)
  // append the error element to the list element
  list.appendChild(error)
}


function setList(results) {
  clearList();
  for (const stop of results) {
    const resultItem = document.createElement('li');
    const resultLink = document.createElement('a');
    resultLink.href = "eachStop.html?docID=" + stop.id;
    resultLink.classList.add('result-item');
    const text = document.createTextNode(stop.name);
    resultLink.appendChild(text);
    resultItem.appendChild(resultLink);
    list.appendChild(resultItem);
  }

  if (results.length === 0) {
    noResults()
  }
}
