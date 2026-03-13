// User data
fetch("/api/user")
    .then((res) => res.json())
    .then((user) => {
        if (user) {
            console.log("Show Uploader");
            document.getElementById("file-uploader").style.visibility = "visible";
        } else {
            console.log("Hide Uploader");
            document.getElementById("file-uploader").style.visibility = "hidden";
        }
    });



function getAllNotes() {
    let allNotes = null;
    fetch("/get/notes")
        .then((res) => res.json())
        .then((notes) => {
            allNotes = notes;
            console.log(allNotes);

            let notesList = document.getElementById("lista-appunti");
            notesList.innerHTML = ""; // Clear existing notes
            allNotes.forEach(note => {
                let noteElement = document.createElement("p");
                noteElement.textContent = note.content;
                notesList.appendChild(noteElement);
                console.log(note);
            });

        });



}