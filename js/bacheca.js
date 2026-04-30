//Switch form visibility
function switchFormState() {
    if (document.getElementById("upload-form-container").style.visibility == "hidden") {
        document.getElementById("upload-form-container").style.visibility = "visible";
    } else {
        resetForm();
        document.getElementById("upload-form-container").style.visibility = "hidden";
    }
}

//Lista di titolo e testo eventi
let allEvents = [];
function updateCardsList() {
    fetch("/get/events")
        .then((res) => res.json())
        .then((events) => {
            allEvents = events;
        });
    return allEvents;
}
updateCardsList();

//Reset the upload file form
function resetForm() {
    document.getElementById("submit-button").style.backgroundColor = "var(--medio)";
    document.getElementById("custom-upload-form").reset();
}

//Toggle card dropdown
function toggleCardDropdown(sender) {
    let dropdown = sender.nextElementSibling;
    if (dropdown.style.display === "none") {
        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "none";
    }
}

//Create the event element
async function createEventElement(eventsList, event, currentUser) {
    //Create main div
    let eventElement = document.createElement("div");
    eventElement.className = "event-element-div";
    eventElement.dataset.userId = event.id;
    //eventElement.addEventListener("click", () => { open(event.content) });

    let userFunctionsHTML = ``;
    let loggedFunctionsHTML = ``;

    try {
        if (currentUser.id === event.author_id) {
            userFunctionsHTML = `
                <li><a href="#" class="card-dropdown-option-font">Modifica</a></li>
                <li><a href="#" class="card-dropdown-option-font">Elimina</a></li>
            `;
            loggedFunctionsHTML = `
                <div class="dropdown-card">
                    <div class="dropdown-card-btn"></div>
                    <div class="dropdown-card-content">
                        <li><a href="#" class="card-dropdown-option-font">Salva</a></li>
                ${userFunctionsHTML}
                </div>
                </div>`;
        } else {
            loggedFunctionsHTML = `
                <div class="dropdown-card">
                    <div class="dropdown-card-btn"></div>
                    <div class="dropdown-card-content">
                        <li><a href="#" class="card-dropdown-option-font">Salva</a></li>
                </div>
                </div>`;
        }
    } catch (error) {
        console.log("Error fetching current user", error);
    }

    let eventHTML = `
        <img src="${event.thumbnail}" class="event-image-thumbnail">
        <div class="event-text-div">
            <div class="event-header">
                <p class="events-title event-title-font">${event.title}</p>`
        + loggedFunctionsHTML +

        `</div>
            <p class="events-description event-description-font">${event.content}</p>
        </div>

    `;


    eventElement.innerHTML = eventHTML;

    eventsList.appendChild(eventElement);
}

//Select the current section
function selectSection(sectionId) {

    let sectionsID = ["miei-eventi", "tutti-eventi"];

    for (let i = 0; i < sectionsID.length; i++) {
        document.getElementById(sectionsID[i]).className = "";
    }

    let section = document.getElementById(sectionId);
    section.className = "selected";
}

//Display All events
async function getAllEvents() {

    const currentUser = await(await fetch("/api/user")).json();


    let allEvents = null;
    fetch("/get/events")
        .then((res) => res.json())
        .then(async (events) => {
            allEvents = events;
            console.log(allEvents);

            let eventsList = document.getElementById("lista-eventi");
            eventsList.innerHTML = ""; // Clear existing events
            for (const event of allEvents) {
                createEventElement(eventsList, event, currentUser)
            };

        });

    selectSection("tutti-eventi");
}

//Initialize page
getAllEvents();

//Display user events
async function getUserEvents() {

    const currentUser = await(await fetch("/api/user")).json();


    let userEvents = null;
    fetch("/get/user/events")
        .then((res) => res.json())
        .then(async (events) => {

            if (events.length === undefined) {
                console.log(events);
                alert("Nessun accesso effettuato");
                return;
            }

            allEvents = events;

            let eventsList = document.getElementById("lista-eventi");
            eventsList.innerHTML = ""; // Clear existing events
            for (const event of allEvents) {
                createEventElement(eventsList, event, currentUser);
            };

            selectSection("miei-eventi");
        });


}


//Search events
let searchEventsInput = document.getElementById("search-events-input");

searchEventsInput.addEventListener("input", async () => {
    const searchText = document.getElementById("search-events-input").value.toLowerCase();

    console.log(searchText);

    const currentUser = await (await fetch("/api/user")).json();

    let eventsList = document.getElementById("lista-eventi");
    eventsList.innerHTML = ""; // Clear existing events
    for (const event of allEvents) {
        console.log(event);
        if (event.title.toLowerCase().includes(searchText)) {
            createEventElement(eventsList, event, currentUser)
        }
    };
});


//Dropdown menu for events