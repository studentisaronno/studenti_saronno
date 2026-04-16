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

//Create the note element
async function createNoteElement(notesList, note) {
    let noteElement = document.createElement("div");
    noteElement.className = "note-element-div";
    noteElement.addEventListener("click", () => { open(note.content) });

    let thumbnailImg = document.createElement("img");
    thumbnailImg.src = note.thumbnail;
    thumbnailImg.className = "note-image-thumbnail";
    noteElement.insertBefore(thumbnailImg, noteElement.firstChild);

    let noteTitle = document.createElement("h3");
    noteTitle.className = "notes-title";
    noteTitle.textContent = note.title;
    noteElement.appendChild(noteTitle);

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

}

//Display user notes
function getUserNotes() {
    let userNotes = null;
    fetch("/get/user/notes")
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