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


//Change file name after uploading files
document.getElementById("file-input").addEventListener("change", (event) => {
    const file = event.target.files[0];
    document.getElementById("file-name").value = file.name;
});


function resetForm() {
    document.getElementById("submit-button").style.backgroundColor = "var(--medio)";
    document.getElementById("custom-upload-form").reset();
}

//Get preview of doc from link
async function pdfPreviw(pdfUrl) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    try {
        // 1. Carica il documento
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        // 2. Prendi la prima pagina
        const page = await pdf.getPage(1);

        // 3. Imposta la scala (zoom) e il canvas
        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // 4. Renderizza la pagina nel canvas
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        await page.render(renderContext).promise;

        // 5. Trasforma il canvas in un'immagine (DataURL) o appendilo al DOM
        const imgUrl = canvas.toDataURL('image/png');

        // // Esempio: mostralo in un elemento <img> esistente
        // let docPreview = document.createElement("img");
        // docPreview.src = imgUrl;

        return imgUrl;

        console.log("Anteprima generata!");
    } catch (error) {
        console.error("Errore nel rendering del PDF:", error);
    }
}

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
                let imgPreview = document.createElement("img");
                imgPreview.src = pdfPreviw(note.content);
                notesList.appendChild(imgPreview);
                console.log(note);
            });

        });

}

function switchFormState() {
    if (document.getElementById("upload-form-container").style.visibility == "hidden") {
        document.getElementById("upload-form-container").style.visibility = "visible";
    } else {
        resetForm();
        document.getElementById("upload-form-container").style.visibility = "hidden";
    }
}