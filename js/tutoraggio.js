//Switch form visibility
function switchFormState() {
    if (document.getElementById("upload-form-container").style.visibility == "hidden") {
        document.getElementById("upload-form-container").style.visibility = "visible";
    } else {
        resetForm();
        document.getElementById("upload-form-container").style.visibility = "hidden";
    }
}

//Lista di titolo e testo tutor
let allTutors = [];
function updateCardsList() {
    allTutors = [];
    fetch("/get/tutors")
        .then((res) => res.json())
        .then((tutors) => {
            allTutors = tutors;
        });
    return allTutors;
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

//Create the tutor element
async function createTutorElement(tutorsList, tutor, currentUser) {
    //Create main div
    let tutorElement = document.createElement("div");
    tutorElement.className = "tutor-element-div";
    tutorElement.dataset.userId = tutor.id;
    //tutorElement.addEventListener("click", () => { open(tutor.content) });

    let userFunctionsHTML = ``;

    if (currentUser !== null) {
        if (currentUser.id === tutor.author_id) {
            userFunctionsHTML = `
            <li><a href="#" class="card-dropdown-option-font">Modifica</a></li>
            <li><a href="#" class="card-dropdown-option-font">Elimina</a></li>
        `;
        } else {
            userFunctionsHTML = ``;
        }
    }
    let tutorHTML = `
        <img src="${tutor.thumbnail}" class="tutor-image-thumbnail">
        <div class="tutor-text-div">
            <div class="tutor-header">
                <p class="  tutor-title-font">${tutor.name} ${tutor.surname}</p>
                <div class="dropdown-card">
                <div class="dropdown-card-btn" onclick="toggleCardDropdown(this)"></div>
                    <div class="dropdown-card-content">
                    <li><a href="#" class="card-dropdown-option-font">Salva</a></li>`
        + userFunctionsHTML +
        `</div>
                    </div>
                    </div>
            <p class="tutor-description-font">Email: ${tutor.email}</p>
            <p class="tutor-description-font">${tutor.description}</p>
        </div>

    `;


    tutorElement.innerHTML = tutorHTML;

    tutorsList.appendChild(tutorElement);
}

//Select the current section
function selectSection(sectionId) {

    let sectionsID = ["miei-tutor", "tutti-tutor"];

    for (let i = 0; i < sectionsID.length; i++) {
        document.getElementById(sectionsID[i]).className = "";
    }

    let section = document.getElementById(sectionId);
    section.className = "selected";
}

//Display All tutors
async function getAllTutors() {

    let allTutors = [];
    const currentUser = await (await fetch("/api/user")).json();

    fetch("/get/tutors")
        .then((res) => res.json())
        .then(async (tutors) => {
            allTutors = tutors;
            console.log(allTutors);

            let tutorsList = document.getElementById("lista-tutors");
            tutorsList.innerHTML = ""; // Clear existing tutors
            for (const tutor of allTutors) {
                createTutorElement(tutorsList, tutor, currentUser)
            };

        });

    selectSection("tutti-tutor");
}

//Initialize page
getAllTutors();

//Display user tutors
async function getUserTutors() {
    const currentUser = await (await fetch("/api/user")).json();

    let userEvents = null;
    fetch("/get/user/tutors")
        .then((res) => res.json())
        .then(async (tutors) => {

            if (tutors.length === undefined) {
                console.log(tutors);
                alert("Nessun accesso effettuato");
                return;
            }

            allTutors = tutors;

            let tutorsList = document.getElementById("lista-tutors");
            tutorsList.innerHTML = ""; // Clear existing tutors
            for (const tutor of allTutors) {
                createTutorElement(tutorsList, tutor, currentUser)
            };

            selectSection("miei-tutor");
        });


}


//Search tutors
let searchEventsInput = document.getElementById("search-tutors-input");

searchEventsInput.addEventListener("input", async () => {
    const searchText = document.getElementById("search-tutors-input").value.toLowerCase();

    const currentUser = await (await fetch("/api/user")).json();

    console.log(searchText);

    let tutorsList = document.getElementById("lista-tutors");
    tutorsList.innerHTML = ""; // Clear existing tutors
    for (const tutor of allTutors) {
        console.log("Tutor:", tutor);
        let text = tutor.name.toLowerCase() + " " + tutor.surname.toLowerCase();
        if (text.includes(searchText)) {
            createTutorElement(tutorsList, tutor, currentUser)
        }
    };
});


//Dropdown menu for tutors