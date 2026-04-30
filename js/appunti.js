//Switch form visibility
function switchFormState() {
    if (document.getElementById("upload-form-container").style.visibility == "hidden") {
        document.getElementById("upload-form-container").style.visibility = "visible";
    } else {
        resetForm();
        document.getElementById("upload-form-container").style.visibility = "hidden";
    }
}

//Change file name after uploading files
document.getElementById("file-input").addEventListener("change", (event) => {
    const file = event.target.files[0];
    document.getElementById("file-name").value = file.name;
});

//Reset the upload file form
function resetForm() {
    document.getElementById("submit-button").style.backgroundColor = "var(--medio)";
    document.getElementById("custom-upload-form").reset();
}

//Select the current section
function selectSection(sectionId) {

    let sectionsID = ["miei-appunti", "tutti-appunti"];

    for (let i = 0; i < sectionsID.length; i++) {
        document.getElementById(sectionsID[i]).className = "";
    }

    let section = document.getElementById(sectionId);
    section.className = "selected";
}

//Create the note element
async function createNoteElement(notesList, note, currentUser) {

    let noteElement = document.createElement("div");
    noteElement.className = "note-element-div";
    noteElement.dataset.userId = note.id;
    // noteElement.addEventListener("click", () => { open(note.content) });


    let userFunctionsHTML = ``;
    let loggedFunctionsHTML = ``;

    try {
        if (currentUser.id === note.author_id) {
            userFunctionsHTML = `
                <li><a href="#" class="card-dropdown-option-font">Modifica</a></li>
                <li><a href="#" class="card-dropdown-option-font">Elimina</a></li>
            `;
            loggedFunctionsHTML = `
                <div class="dropdown-card">
                    <div class="dropdown-card-btn" onclick="toggleCardDropdown(this)"></div>
                    <div class="dropdown-card-content">
                        <li><a href="#" class="card-dropdown-option-font">Salva</a></li>
                ${userFunctionsHTML}
                </div>
                </div>`;
        } else {
            loggedFunctionsHTML = `
                <div class="dropdown-card">
                    <div class="dropdown-card-btn" onclick="toggleCardDropdown(this)"></div>
                    <div class="dropdown-card-content">
                        <li><a href="#" class="card-dropdown-option-font">Salva</a></li>
                </div>
                </div>`;
        }
    } catch (error) {
        console.log("Error fetching current user", error);
    }

    let eventHTML = `
        <div class="note-header">
            <p class="notes-title-font">${note.title}</p>
            <div class="note-setting">
        </div>
        

    `;

    let noteHeader = document.createElement("div");
    noteHeader.className = "note-header";
    noteElement.appendChild(noteHeader);

    let noteTitle = document.createElement("p");
    noteTitle.className = "notes-title-font";
    noteTitle.textContent = note.title;
    noteHeader.appendChild(noteTitle);

    let noteSetting = document.createElement("div");
    noteSetting.className = "note-setting";
    noteHeader.appendChild(noteSetting);

    let thumbnailImg = document.createElement("img");
    thumbnailImg.src = note.thumbnail;
    thumbnailImg.className = "note-image-thumbnail";
    noteElement.appendChild(thumbnailImg);

    notesList.appendChild(noteElement);
}

//Display All notes
function getAllNotes() {

    let allNotes = null;
    fetch("/get/notes")
        .then((res) => res.json())
        .then(async (notes) => {

            allNotes = notes;
            console.log(allNotes);

            let notesList = document.getElementById("lista-appunti");
            notesList.innerHTML = ""; // Clear existing notes
            for (const note of allNotes) {
                createNoteElement(notesList, note)
            };

        });

    selectSection("tutti-appunti");

}

getAllNotes();

//Display user notes
function getUserNotes() {


    let userNotes = null;
    fetch("/get/user/notes")
        .then((res) => res.json())
        .then(async (notes) => {

            if (notes.length === undefined) {
                console.log(notes.error);
                alert("Nessun accesso effettuato");
                return;
            }

            allNotes = notes;
            console.log(allNotes);

            let notesList = document.getElementById("lista-appunti");
            notesList.innerHTML = ""; // Clear existing notes
            for (const note of allNotes) {
                createNoteElement(notesList, note)
            };

            selectSection("miei-appunti");
        });
}


//Search notes
let searchNotesInput = document.getElementById("search-notes-input");

searchNotesInput.addEventListener("input", async () => {
    const searchText = document.getElementById("search-notes-input").value.toLowerCase();

    console.log(searchText);

    let allNotes = null;
    fetch("/get/notes")
        .then((res) => res.json())
        .then(async (notes) => {
            allNotes = notes;


            let notesList = document.getElementById("lista-appunti");
            notesList.innerHTML = ""; // Clear existing notes
            for (const note of allNotes) {
                if (note.title.toLowerCase().includes(searchText)) {
                    createNoteElement(notesList, note)
                }
            };

        });
});