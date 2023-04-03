// stores collection of stops in array to iterate in functions below
const stopsRef = firebase.firestore().collection('stops');
const stops = [];

// iterate through the stops collection and add each name to the list
stopsRef.get().then((aStop) => {
    aStop.forEach((doc) => {
        const name = doc.data().name;
        stops.push({ id: doc.id, name: name });

        // initializes dropdown list with all stop names in upload modal 
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.classList.add('dropdown-item');
        const txt = document.createTextNode(name);
        a.appendChild(txt);
        li.appendChild(a);
        updateList.appendChild(li);
        a.addEventListener('click', (e) => {
            document.querySelector('#searchbtn').innerHTML = e.target.textContent;
            toggleSearch();
        });
    });
});

/* ----------------------------------------------------------
             search function for search modal
------------------------------------------------------------- */
// search input button
const searchInput = document.querySelector('.input')

// listen for key inputs and match with stop names from Firebase
searchInput.addEventListener("input", (e) => {
    let value = e.target.value

    if (value && value.trim().length > 0) {
        value = value.trim().toLowerCase();
        const filteredStops = stops.filter(stop => stop.name.trim().toLowerCase().includes(value));

        //returns results of setList if value of search is included in bus name
        setList(filteredStops.filter(bus => {
            return bus.name.toLowerCase().includes(value)
        }))
    } else {
        clearList();
    }
})

// remove the results from the page
function clearList() {
    list.innerHTML = ''
}

// function returns 'no results' dialog to user for searches with no matches
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
        resultItem.addEventListener('click', (e) => {
            document.querySelector('#searchbtn').innerHTML = e.target.textContent;
            toggleSearch();
        });
        list.appendChild(resultItem);
    }

    if (results.length === 0) {
        noResults()
    }
}


/* ----------------------------------------------------------
    search function for dropdown search in update post modal
------------------------------------------------------------- */
// when user clicks button, toggle shows/hides the dropdown content
function toggleSearch() {
    document.getElementById("searchDropdown").classList.toggle("show");
}

// creates reference to the updateList element
const updateList = document.getElementById("updateList");

// search input button
const dropdownInput = document.querySelector('.inputDropdown')

// listens for key inputs and matches with stop names from Firebase
dropdownInput.addEventListener("input", (e) => {
    let value = e.target.value;

    if (value && value.trim().length > 0) {
        value = value.trim().toLowerCase();
        const filteredStops = stops.filter(stop => stop.name.trim().toLowerCase().includes(value));

        // clears the list before adding the filtered results
        updateList.innerHTML = "";

        // adds list items for each filtered stop
        filteredStops.forEach(stop => {
            const dropdownItem = document.createElement('li');
            const dropdownLink = document.createElement('a');
            dropdownLink.href = "#";
            dropdownLink.classList.add('dropdown-item');
            const dropdownText = document.createTextNode(stop.name);
            dropdownLink.appendChild(dropdownText);
            dropdownItem.appendChild(dropdownLink);
            dropdownItem.addEventListener('click', (e) => {
                document.querySelector('#searchbtn').innerHTML = e.target.textContent;
                toggleSearch();
            });
            updateList.appendChild(dropdownItem);
        })
    } else {
        // if no input value, show all stops
        updateList.innerHTML = "";
        stops.forEach(stop => {
            const dropdownItem = document.createElement('li');
            const dropdownLink = document.createElement('a');
            dropdownLink.href = "#";
            dropdownLink.classList.add('dropdown-item');
            const dropdownText = document.createTextNode(stop.name);
            dropdownLink.appendChild(dropdownText);
            dropdownItem.appendChild(dropdownLink);
            dropdownItem.addEventListener('click', (e) => {
                document.querySelector('#searchbtn').innerHTML = e.target.textContent;
                toggleSearch();
            });
            updateList.appendChild(dropdownItem);
        })
    }
})

// when the upload icon is selected, innerHTML of searchbtn reset to "Transit Stops"
document.querySelector('#uploadPost').addEventListener('click', (e) => {
    document.querySelector('#searchbtn').innerHTML = "Transit Stops";
});
