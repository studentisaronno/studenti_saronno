/* Questa è un riga di test scritta da Elisa per far vedere ad Alessia come funziona Git */

/* OLD

if (window.location.pathname === "/index.html") {
    fetch("./header.html")
        .then((response) => response.text())
        .then((data) => {
            document.getElementById("header").innerHTML = data;
        });

    fetch("./footer.html")
        .then((response) => response.text())
        .then((data) => {
            document.getElementById("footer").innerHTML = data;
        });
} else {
    fetch("../header.html")
        .then((response) => response.text())
        .then((data) => {
            document.getElementById("header").innerHTML = data;
        });

    fetch("../footer.html")
        .then((response) => response.text())
        .then((data) => {
            document.getElementById("footer").innerHTML = data;
        });
}
console.log(window.location.pathname);

*/

// var headerPath =
//     window.location.pathname === "/index.html"
//         ? "./header.html"
//         : "../header.html";
// var footerPath =
//     window.location.pathname === "/index.html"
//         ? "./footer.html"
//         : "../footer.html";

// console.log(window.location.pathname)

const headerPath = "./header.html";
const footerPath = "./footer.html";

var header = fetch(headerPath)
    .then((response) => response.text())
    .then((data) => {
        document.getElementById("header").innerHTML = data;
    });

var footer = fetch(footerPath)
    .then((response) => response.text())
    .then((data) => {
        document.getElementById("footer").innerHTML = data;
    });

Promise.all([header, footer])
    .then(() => {
        console.log("Header e Footer caricati con successo!");
    })
    .catch((error) => {
        console.error("Errore nel caricamento di Header o Footer:", error);
    });
